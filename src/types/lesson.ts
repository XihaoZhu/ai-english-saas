export type ConversationMessage = {
    role: "ai" | "user";
    text: string;
};

export type Lesson = {
    id: string;
    title: string;

    scenario: string;
    profession: string;
    level: string;

    createdAt: string;

    keywords: string[];

    conversation: ConversationMessage[];
};