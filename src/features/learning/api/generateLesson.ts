import { Lesson } from "@/src/types/lesson";

type Input = {
    prompt: string;
    keywords: string;
    length: "Short" | "Medium" | "Long";
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
};

export async function generateLesson(input: Input): Promise<Lesson> {
    await new Promise((res) => setTimeout(res, 500));

    const title = input.prompt.slice(0, 40);
    const article = [
        `The story begins with ${input.prompt.toLowerCase()}.`,
        `It is written for ${input.level} readers and kept ${input.length.toLowerCase()}.`,
        `The main ideas stay close to ${input.keywords}, so the text feels practical and easy to reuse.`,
        `As the reader moves through it, the language slowly introduces slightly harder words without losing clarity.`,
    ].join(" ");

    return {
        id: crypto.randomUUID(),
        title,
        prompt: input.prompt,
        keywords: input.keywords,
        length: input.length,
        level: input.level,
        article,
        word_count: input.length === "Short" ? 180 : input.length === "Medium" ? 320 : 520,
        vocabulary: [
            {
                word: "focus",
                phonetic: "/ˈfəʊkəs/",
                meaning: "the main thing that attention is directed to",
                tier: "core",
                explanation: "This is a high-frequency word that a C1 reader should already know well.",
            },
            {
                word: "practical",
                phonetic: "/ˈpræktɪkəl/",
                meaning: "useful and related to real life",
                tier: "reinforce",
                explanation: "This is worth reinforcing because it appears often in reading and writing tasks.",
            },
            {
                word: "nuance",
                phonetic: "/ˈnjuːɑːns/",
                meaning: "a small but important difference in meaning or feeling",
                tier: "next",
                explanation: "This is a slightly harder word that belongs to the next level of vocabulary growth.",
            },
            {
                word: "approximate",
                phonetic: "/əˈprɒksɪmət/",
                meaning: "close to the correct value, amount, or idea",
                tier: "next",
                explanation: "This is an extension word that helps the reader step into the next difficulty band.",
            },
        ],
        createdAt: new Date().toISOString(),
    };
}
