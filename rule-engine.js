const RULE_ENGINE = {
    COMPANY_HARAM: {
        riba: ['bank', 'banking', 'interest', 'loan', 'mortgage', 'credit', 'financial services', 'investment bank', 'commercial bank', 'retail bank', 'private bank', 'lending', 'usury'],
        alcohol: ['alcohol', 'liquor', 'wine', 'beer', 'brewery', 'distillery', 'vodka', 'whiskey', 'champagne', 'spirits'],
        gambling: ['casino', 'gambling', 'betting', 'lottery', 'poker', 'wager', 'sports betting', 'online gambling'],
        pork: ['pork', 'swine', 'pig', 'bacon', 'ham', 'porcine'],
        adult: ['pornography', 'adult entertainment', 'sex industry', 'brothel', 'escort', 'strip club', 'onlyfans'],
        weapons: ['weapon', 'arms manufacturer', 'defense contractor', 'military contractor', 'gun manufacturer', 'firearm', 'missile', 'tank'],
        tobacco: ['tobacco', 'cigarette', 'cigar', 'nicotine', 'vaping', 'e-cigarette'],
        fraud: ['pyramid scheme', 'ponzi', 'scam', 'crypto scam'],
        prohibited_trade: ['drug marketplace', 'dark web', 'illicit trade', 'prohibited goods', 'haram commerce'],
        spyware: ['spyware', 'surveillance software', 'keylogger', 'stalkerware', 'employee monitoring'],
        piracy: ['software piracy', 'keygen', 'crack', 'warez', 'pirated software', 'drm removal'],
        exam_cheating: ['exam cheating', 'plagiarism tool', 'essay mill', 'academic dishonesty'],
        riba_software: ['banking software', 'trading platform', 'loan management', 'mortgage software', 'interest calculator'],
        immorality_software: ['deepfake', 'document forgery', 'fake news generator', 'phishing tool'],
        mlm: ['multi-level marketing', 'network marketing', 'pyramid selling', 'herbalife', 'amway', 'avon', 'mary kay', 'nu skin', 'forever living', 'tupperware', 'cutco', 'primerica', 'beachbody', 'younique', 'monat', 'it works', 'arbonne', 'doterra', 'young living', 'scentsy', 'lularoe', 'advocare', 'usana', 'qnet', 'jeunesse', 'worldventures', 'onecoin', 'bitconnect', 'crowd1']
    },
    COMPANY_SHUBHA: {
        insurance: ['insurance', 'reinsurance', 'actuarial', 'underwriting'],
        crypto: ['cryptocurrency', 'bitcoin', 'blockchain', 'crypto exchange', 'defi', 'nft'],
        media: ['music', 'film studio', 'entertainment', 'streaming', 'hollywood'],
        food: ['restaurant chain', 'fast food', 'food processing', 'meat packing'],
        tech: ['saas', 'software', 'data analytics', 'cloud computing', 'ai company']
    },
    ROLE_HARAM: {
        accounting_riba: ['accountant', 'accounting', 'bookkeeper', 'financial analyst', 'treasury', 'credit analyst', 'loan officer', 'mortgage advisor', 'cfo', 'finance manager'],
        software_haram: ['software engineer', 'developer', 'programmer', 'backend', 'frontend', 'full stack', 'mobile developer', 'devops'],
        marketing_haram: ['marketing manager', 'digital marketing', 'growth hacker', 'seo', 'content marketer', 'brand manager', 'advertising'],
        data_haram: ['data scientist', 'data analyst', 'data engineer', 'business intelligence', 'machine learning'],
        legal_haram: ['lawyer', 'attorney', 'legal counsel', 'contract manager', 'paralegal', 'regulatory affairs']
    },
    ROLE_SHUBHA: {
        mixed_role: ['general manager', 'operations manager', 'project manager', 'product manager', 'hr manager', 'consultant', 'business analyst']
    },
    MAPPING: {
        riba: "RIBA",
        alcohol: "ALCOHOL_GAMBLING",
        gambling: "ALCOHOL_GAMBLING",
        pork: "PORK",
        adult: "INDECENCY",
        weapons: "DESTRUCTION",
        tobacco: "HARM",
        fraud: "FRAUD",
        prohibited_trade: "PROHIBITED_TRADE",
        spyware: "SPYWARE",
        piracy: "PIRACY",
        exam_cheating: "EXAM_CHEATING",
        riba_software: "RIBA_SOFTWARE",
        immorality_software: "IMMORALITY",
        mlm: "MLM"
    },
    SCRIPTURES: {
        RIBA: { quran: "2:275", hadith: "bukhari:2083" },
        ALCOHOL_GAMBLING: { quran: "5:90-91", hadith: "muslim:2003" },
        PORK: { quran: "2:173", hadith: "bukhari:5400" },
        INDECENCY: { quran: "24:30-31", hadith: "muslim:2121" },
        DESTRUCTION: { quran: "2:205", hadith: "muslim:81" },
        HARM: { quran: "2:195", hadith: "ibnmajah:3371" },
        FRAUD: { quran: "83:1-6", hadith: "muslim:101" },
        SPYWARE: { quran: "49:12", hadith: "abudawud:4875" },
        PIRACY: { quran: "5:32", hadith: "bukhari:2166" },
        EXAM_CHEATING: { quran: "83:1-6", hadith: "muslim:101" },
        RIBA_SOFTWARE: { quran: "2:279", hadith: "bukhari:2083" },
        IMMORALITY: { quran: "24:19", hadith: "muslim:1865" },
        MLM: { quran: "8:27", hadith: "muslim:101" },
        SINS_COOP: { quran: "5:2", hadith: "muslim:1865" },
        MARKETING_HARAM: { quran: "4:107", hadith: "abudawud:2929" },
        LEGAL_HARAM: { quran: "2:188", hadith: "abudawud:3580" },
        HALAL_DEFAULT: { quran: "5:1", hadith: "bukhari:2051" },
        SHUBHA_MIXED: { quran: "2:168", hadith: "bukhari:2051" }
    }
};
