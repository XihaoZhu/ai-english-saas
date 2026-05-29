type Input = {
    scenario: string;
    level: string;
    profession: string;
};

export async function generateLesson(input: Input) {

    await new Promise((res) => setTimeout(res, 500));


    if (Math.random() < 0.1) {
        throw new Error("AI service temporarily unavailable");
    }

    return {
        conversation: [
            { role: "ai", text: `Let's practice ${input.scenario}` },
            { role: "user", text: "Sounds good!" },
            { role: "ai", text: "Great, I'll guide you step by step." },
        ],
        keywords: ["negotiate", "clarify", "schedule"],
    };
}