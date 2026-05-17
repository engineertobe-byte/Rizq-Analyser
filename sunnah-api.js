const SUNNAH_API_BASE = "https://sunnah.com/api/collections";

async function getHadith(collection, number, lang) {
    try {
        // Note: Sunnah.com doesn't have a wide-open REST API for a specific hadith number 
        // in the same way as Quran.com. We simulate the retrieval.
        // In a real production env, we would use a mirrored dataset or a specific API wrapper.
        
        const res = await fetch(`${SUNNAH_API_BASE}/${collection}/hadiths/${number}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        
        return {
            ar: data.arabic,
            en: data.english,
            source: `${collection} #${number}`
        };
    } catch (e) {
        return { ar: "", en: `Hadith ${collection} #${number} (Please verify on Sunnah.com)`, source: `${collection} #${number}` };
    }
}

module.exports = { getHadith };
