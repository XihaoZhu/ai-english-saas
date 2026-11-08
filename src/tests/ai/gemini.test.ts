import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateLesson, LessonTimeoutError } from "@/src/lib/ai/gemini";
import type { LessonDraftInput } from "@/src/features/lessons/types/lesson";

// Mock Google GenAI SDK
const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
    GoogleGenAI: class {
        models = {
            generateContent: mockGenerateContent,
        };
    },
}));

describe("generateLesson", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks();
    })

    const input = {
        prompt: "Write a lesson about sample words.",
        keywords: "sample, example",
        length: "Short",
        level: "A1",
    } satisfies LessonDraftInput;

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


    it("should generate a lesson from Gemini response", async () => {
        // Arrange
        mockGenerateContent.mockResolvedValue({
            text: JSON.stringify(mockLesson),
        });

        const result = await generateLesson(input);


        expect(result.title).toBe(mockLesson.title);
        expect(result.article).toBe(mockLesson.article);
        expect(result.vocabulary).toEqual(mockLesson.vocabulary);
        expect(result.word_count).toBe(mockLesson.article.split(" ").length);
        expect(result.prompt).toBe(input.prompt);
        expect(result.keywords).toBe(input.keywords);
        expect(result.length).toBe(input.length);
        expect(result.level).toBe(input.level);
        expect(result.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(result.createdAt).toBeDefined();

        expect(mockGenerateContent).toHaveBeenCalledOnce()

        expect(mockGenerateContent).toHaveBeenCalledWith(
            expect.objectContaining({
                model: "gemini-2.5-flash",
            })
        );
    });


    it("should propagate an error when Gemini API fails", async () => {

        mockGenerateContent.mockRejectedValue(
            new Error("API call failed")
        );

        await expect(generateLesson(input))
            .rejects.toThrow("API call failed");
    });

    it("should abort Gemini request after 20 seconds", async () => {
        vi.useFakeTimers();


        mockGenerateContent.mockImplementation(() => {
            return new Promise(() => { })
        })

        const generatePromise = generateLesson(input)

        const abortSignal = mockGenerateContent.mock.calls[0][0].config.abortSignal;

        expect(abortSignal.aborted).toBe(false);

        const rejectionAssertion = expect(generatePromise)
            .rejects.toThrow(LessonTimeoutError);

        vi.advanceTimersByTime(20000);

        expect(abortSignal.aborted).toBe(true);
        expect(abortSignal.reason).toBeInstanceOf(LessonTimeoutError);

        await rejectionAssertion;

    });



});
