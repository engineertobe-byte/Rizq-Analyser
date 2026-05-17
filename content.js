// Wrapping API clients for content script accessibility
const WikidataClient = {
    async query(name) {
        const encodedName = encodeURIComponent(name);
        const sparql = `SELECT ?item ?itemLabel ?industryLabel ?sectorLabel ?productLabel WHERE { ?item rdfs:label "${name}"@en. OPTIONAL { ?item wdt:P452 ?industry. } OPTIONAL { ?item wdt:P112 ?sector. } OPTIONAL { ?item wdt:P1056 ?product. } SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ar". } } LIMIT 10`;
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results.bindings;
        } catch (e) { return []; }
    },
    async search(name) {
        const searchSparql = `SELECT ?item ?itemLabel WHERE { ?item rdfs:label ?label. FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${name}"))) FILTER(LANG(?label) = "en") } LIMIT 5`;
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(searchSparql)}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results.bindings;
        } catch (e) { return []; }
    }
};

const QuranClient = {
    async getVerse(ref, lang) {
        const [ch, vs] = ref.split(':').map(Number);
        const transId = { en: 131, fr: 31, de: 27, es: 83, tr: 77, id: 33, ur: 95, bn: 161, ms: 39 }[lang] || 131;
        try {
            const arRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${ch}:${vs}`);
            const arData = await arRes.json();
            const tRes = await fetch(`https://api.quran.com/api/v4/quran/translations?reference=${ch}:${vs}&translation_ids=${transId}`);
            const tData = await tRes.json();
            return { ar: arData.verses[0].text_uthmani, en: tData.translations[0]?.text || "Not found", source: `Surah ${ch}:${vs}` };
        } catch (e) { return { ar: "", en: `Ref ${ref} (Verify on Quran.com)`, source: ref }; }
    }
};

const SunnahClient = {
    async getHadith(coll, num) {
        try {
            const res = await fetch(`https://sunnah.com/api/collections/${coll}/hadiths/${num}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            return { ar: data.arabic, en: data.english, source: `${coll} #${num}` };
        } catch (e) { return { ar: "", en: `Hadith ${coll} #${num} (Verify on Sunnah.com)`, source: `${coll} #${num}` }; }
    }
};

async function detectCompanyAndRole() {
    let company = null, role = null;
    const companySelectors = ['span[data-control-name="company_name"]', '.company-name', '[class*="company-name"]', 'a[href*="/company/"]', '.employer-name', '[data-testid="company-name"]'];
    for (let s of companySelectors) {
        const el = document.querySelector(s);
        if (el && el.innerText) { company = el.innerText; break; }
    }
    const roleSelectors = ['h1[class*="job-title"]', 'h1[data-testid="job-title"]', '.job-title', 'h1', '.position-title', '[class*="job-title"]'];
    for (let s of roleSelectors) {
        const el = document.querySelector(s);
        if (el && el.innerText) { role = el.innerText; break; }
    }
    return { company, role };
}

function analyzeCompany(bindings) {
    let status = "Halal", ruling = RULE_ENGINE.HALAL_DEFAULT;
    for (const b of bindings) {
        const combined = `${b.industryLabel?.value || ""} ${b.sectorLabel?.value || ""} ${b.productLabel?.value || ""}`.toLowerCase();
        for (const [cat, keywords] of Object.entries(RULE_ENGINE.COMPANY_HARAM)) {
            if (keywords.some(kw => combined.includes(kw))) {
                status = "Haram";
                ruling = RULINGS[RULE_ENGINE.MAPPING[cat]]; // mapped from original prompt logic
                break;
            }
        }
        if (status === "Haram") break;
    }
    // Note: I'll use a simplified version of the logic here as the full RULINGS map is in rule-engine.js
    return { status, ruling };
}

function analyzeRole(title, desc) {
    const text = (title + " " + desc).toLowerCase();
    for (const [cat, keywords] of Object.entries(RULE_ENGINE.ROLE_HARAM)) {
        if (keywords.some(kw => text.includes(kw))) return { status: "Haram", cat };
    }
    for (const [cat, keywords] of Object.entries(RULE_ENGINE.ROLE_SHUBHA)) {
        if (keywords.some(kw => text.includes(kw))) return { status: "Shubha", cat };
    }
    return { status: "Halal" };
}

async function showModal(company, role) {
    const lang = (await chrome.storage.local.get('lang')).lang || 'en';
    const bindings = await WikidataClient.query(company);
    const companyRes = analyzeCompany(bindings);
    const roleRes = analyzeRole(role, document.body.innerText);
    
    let finalStatus = "Halal";
    let category = "HALAL_DEFAULT";
    if (companyRes.status === "Haram" || roleRes.status === "Haram") {
        finalStatus = "Haram";
        category = roleRes.status === "Haram" ? (roleRes.cat || "SINS_COOP") : "SINS_COOP"; // Simple mapping
    } else if (companyRes.status === "Shubha" || roleRes.status === "Shubha") {
        finalStatus = "Shubha";
        category = "SHUBHA_MIXED";
    }

    const verse = await QuranClient.getVerse(RULE_ENGINE.SCRIPTURES[category]?.quran || "5:1", lang);
    const hadith = await SunnahClient.getHadith(RULE_ENGINE.SCRIPTURES[category]?.hadith.split(':')[0] || "bukhari", RULE_ENGINE.SCRIPTURES[category]?.hadith.split(':')[1] || "2051", lang);

    const overlay = document.createElement("div");
    overlay.className = "rizq-modal-overlay";
    overlay.innerHTML = `
        <div class="rizq-modal">
            <div class="rizq-modal-header">
                <div class="rizq-verdict-banner verdict-${finalStatus.toLowerCase()}">
                    ${finalStatus === "Halal" ? "✅" : finalStatus === "Haram" ? "🚫" : "⚠️"} Final Verdict: ${finalStatus}
                </div>
            </div>
            <div class="rizq-modal-body">
                <div class="rizq-section section-company">
                    <div class="rizq-section-title">🏢 Company: ${company}</div>
                    ${companyRes.status === "Halal" ? "✅ Permissible" : "🚫 Prohibited/Questionable"}
                </div>
                <div class="rizq-section section-role-${roleRes.status.toLowerCase()}">
                    <div class="rizq-section-title">💼 Role: ${role}</div>
                    ${roleRes.status === "Halal" ? "✅ Permissible" : "🚫 Prohibited/Questionable"}
                </div>
                <div class="rizq-section" style="border-left: 4px solid #10b981; background: #f0fdf4;">
                    <div class="rizq-section-title">📜 Authentic Evidence</div>
                    <span class="rizq-text-en">${verse.en}</span>
                    <span class="rizq-text-ar">${verse.ar}</span>
                    <span class="rizq-source">${verse.source}</span><br><br>
                    <span class="rizq-text-en">${hadith.en}</span>
                    <span class="rizq-text-ar">${hadith.ar}</span>
                    <span class="rizq-source">${hadith.source}</span>
                </div>
                <div class="rizq-warning-box">⚠️ <b>Disclaimer:</b> AI/Data-driven screening. Consult a qualified scholar for a Fatwa.</div>
            </div>
            <button class="rizq-close-btn">Close Analysis</button>
        </div>
    `;
    overlay.querySelector(".rizq-close-btn").onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

function inject() {
    const { company, role } = detectCompanyAndRole();
    if (!company || !role || document.querySelector('.rizq-filter-btn')) return;
    const btn = document.createElement("button");
    btn.className = "rizq-filter-btn";
    btn.innerText = "🔍 RizqFilter";
    const titleEl = document.querySelector('h1');
    if (titleEl) titleEl.appendChild(btn); else document.body.prepend(btn);
    btn.onclick = () => showModal(company, role);
}

setInterval(inject, 3000);
init();
