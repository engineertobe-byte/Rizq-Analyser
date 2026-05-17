# 🔍 RizqFilter Universal (Zero-LLM Edition)

RizqFilter is a deterministic, high-precision job screening tool for Muslims. It replaces AI generation with a strict rule engine and authentic API integrations to eliminate hallucinations.

## 🛠️ Architecture
- **Company Analysis:** Structured data retrieval via Wikidata SPARQL (Sectors, Industries, Products).
- **Role Analysis:** Keyword-based deterministic screening of job titles and descriptions.
- **Evidence:** Real-time retrieval of Uthmani Arabic text and verified translations from **Quran.com** and **Sunnah.com**.
- **Verdict Engine:** A hierarchical priority system (`Haram` > `Shubha` > `Halal`).

## ⚙️ How it Works
1. **Detection:** Detects Company/Role across LinkedIn, Indeed, Glassdoor, and other platforms.
2. **Retrieval:** Queries Wikidata for company structure.
3. **Evaluation:** Matches data against a strict set of Sharia-based keywords.
4. **Verification:** Maps the result to specific, authentic verses and hadiths via official APIs.

## Installation
1. Load the `sight_screener` folder as an "Unpacked Extension" in Chrome (`chrome://extensions`).
2. Enable **Developer Mode**.
3. Navigate to any job page and click the **🔍 RizqFilter** button.

## 🌍 Multilingual Support
Auto-detects browser language and fetches corresponding translations from the Quran API.

## Disclaimer
This tool provides automated screening. Final religious rulings must come from qualified Islamic scholars.
