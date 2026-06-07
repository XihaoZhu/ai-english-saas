import { Lesson } from "@/src/types/lesson";

type Input = {
    scenario: string;
    level: string;
    profession: string;
};

export async function generateLesson(input: Input): Promise<Lesson> {

    await new Promise((res) => setTimeout(res, 500));


    if (Math.random() < 0.1) {
        throw new Error("AI service temporarily unavailable");
    }

    return {
        id: crypto.randomUUID(),

        title: input.scenario,

        scenario: input.scenario,
        profession: input.profession,
        level: input.level,

        createdAt: new Date().toISOString(),

        keywords: [
            "negotiate",
            "clarify",
            "schedule",
        ],

        conversation: [
            {
                role: "ai",
                text: `Let's practice ${input.scenario}`,
            },
            {
                role: "user",
                text: "Sounds good!",
            },
            {
                role: "ai",
                text: "Let's begin.",
            },
        ],
    };
}