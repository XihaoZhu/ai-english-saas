export type ReadingWordTier = "core" | "reinforce" | "next";

export type ReadingWord = {
    word: string;
    phonetic: string;
    meaning: string;
    tier: ReadingWordTier;
    explanation: string;
};

export type Lesson = {
    id: string;
    user_id: string;
    title: string;
    prompt: string;
    keywords: string;
    length: "Short" | "Medium" | "Long";
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    article: string;
    word_count: number;
    vocabulary: ReadingWord[];
    created_at: string;
};
