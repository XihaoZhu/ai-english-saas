export type ReadingWordTier = "core" | "reinforce" | "next";

export type ReadingWord = {
    word: string;
    phonetic: string;
    meaning: string;
    tier: ReadingWordTier;
    explanation: string;
};

export type LessonLength = "Short" | "Medium" | "Long";

export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonDraftInput = {
    prompt: string;
    keywords: string;
    length: LessonLength;
    level: LessonLevel;
};

export type GeneratedLesson = {
    title: string;
    article: string;
    vocabulary: ReadingWord[];
};

export type GeneratedLessonResult = LessonDraftInput &
    GeneratedLesson & {
    id: string;
    word_count: number;
    createdAt: string;
};

export type LessonRecord = LessonDraftInput & GeneratedLesson & {
    id: string;
    word_count: number;
    user_id: string;
    created_at: string;
};

export type Lesson = LessonRecord;
