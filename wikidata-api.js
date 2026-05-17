async function queryWikidata(companyName) {
    const encodedName = encodeURIComponent(companyName);
    const sparql = `SELECT ?item ?itemLabel ?industryLabel ?sectorLabel ?productLabel WHERE {
        ?item rdfs:label "${companyName}"@en.
        OPTIONAL { ?item wdt:P452 ?industry. }
        OPTIONAL { ?item wdt:P112 ?sector. }
        OPTIONAL { ?item wdt:P1056 ?product. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ar". }
    } LIMIT 10`;
    
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.bindings;
    } catch (e) {
        return [];
    }
}

async function searchWikidata(companyName) {
    const searchSparql = `SELECT ?item ?itemLabel WHERE {
        ?item rdfs:label ?label.
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${companyName}")))
        FILTER(LANG(?label) = "en")
    } LIMIT 5`;
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(searchSparql)}&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.bindings;
    } catch (e) {
        return [];
    }
}

module.exports = { queryWikidata, searchWikidata };
