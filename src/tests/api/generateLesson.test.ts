import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

import { generateLesson } from "@/src/features/learning/api/generateLesson";
import { LessonDraftInput } from "@/src/features/lessons/types/lesson";


const mockLesson = {
    title: "Sample Lesson",
    article: "This is a sample article for testing.",
    vocabulary: [
        {
            word: 'sample',
            phonetic: 'sæmpəl',
            meaning: 'a small part or quantity intended to show what the whole is like',
            tier: 'core',
            explanation: 'A typical example used to illustrate a concept.',
        }
    ],
};

const input = {
    prompt: "Write a lesson about sample words.",
    keywords: "sample, example",
    length: "Short",
    level: "A1",
} satisfies LessonDraftInput;

describe("API client", () => {

    beforeEach(() => {
        vi.stubGlobal("fetch", mockFetch);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
    })

    const mockFetch = vi.fn()



    it('generates a lesson', async () => {


        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockLesson,
        });

        const result = await generateLesson(input)

        expect(mockFetch).toHaveBeenCalledOnce()

        expect(mockFetch).toHaveBeenCalledWith("/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })

        expect(result).toEqual(mockLesson)

    })


    it("should throw the server error message when the API returns 400", async () => {

        mockFetch.mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: "Invalid request input" }) });

        await expect(generateLesson(input)).rejects.toThrow("Invalid request input");

        expect(mockFetch).toHaveBeenCalledOnce();
    })

    it("should throw a fallback error when the error response body is invalid JSON", async () => {

        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: vi.fn().mockRejectedValue(
                new SyntaxError("Unexpected token")
            ),
        })

        await expect(generateLesson(input)).rejects.toThrow("Failed to generate lesson.");

        expect(mockFetch).toHaveBeenCalledOnce();

    });

})