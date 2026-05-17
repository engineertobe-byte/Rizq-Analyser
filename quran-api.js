const QURAN_API_BASE = "https://api.quran.com/api/v4";
const TRANSLATIONS = {
    en: 131, fr: 31, de: 27, es:  la 83, tr: 77, id: 33, ur: 95, bn: 161, ms: 39, ar: null
};

async function getVerse(reference, lang) {
    const [chapter, verse] = reference.split(':').map(Number);
    if (!chapter || !verse) return { text: "Reference error", ar: "" };

    try {
        // Fetch Arabic text
        const arRes = await fetch(`${QURAN_API_BASE}/verses/by_key/${chapter}:${verse}`);
        const arData = await arRes.json();
        const arabicText = arData.verses[0].text_uthmani;

        // Fetch translation
        const transId = TRANSLATIONS[lang] || 131;
        const transRes = await fetch(`${QURAN_API_BASE}/quran/translations?reference=${chapter}:${verse}&translation_ids=${transId}`);
        const transData = await transRes.json();
        const translationText = transData.translations[0]?.text || "Translation unavailable";

        return {
            ar: arabicText,
            en: translationText,
            source: `Surah ${chapter}:${verse}`
        };
    } catch (e) {
        return { ar: "", en: `Reference ${reference} (Please verify on Quran.com)`, source: reference };
    }
}

module.exports = { getVerse }; // Using commonjs pattern for content scripts if handled by a bundler, otherwise just a global object
