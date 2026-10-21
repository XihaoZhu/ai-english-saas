import { POST } from "@/src/app/api/gemini/route";
import type { GeneratedLessonResult, LessonDraftInput } from "@/src/features/lessons/types/lesson";
import { vi, describe, it, expect, beforeEach } from "vitest";


const { generateLesson } = vi.hoisted(() => ({
    generateLesson: vi.fn(),
}));

vi.mock("@/src/lib/ai/gemini", () => ({
    generateLesson: generateLesson
}));


const input = {
    prompt: "Write a lesson about sample words.",
    keywords: "sample, example",
    length: "Short",
    level: "A1",
} satisfies LessonDraftInput;

const createRequest = (requestInput: unknown = input) =>
    new Request("http://localhost:3000/api/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestInput),
    })

const mockLesson = {
    ...input,
    title: "Sample Lesson",
    article: "This is a sample article for testing.",
    vocabulary: [],
    id: "test-id",
    word_count: 7,
    createdAt: "2023-01-01T00:00:00Z",
} satisfies GeneratedLessonResult;

describe("POST /api/gemini", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });


    it("should return a 200 status code when success", async () => {

        generateLesson.mockResolvedValue(mockLesson)

        const response = await POST(createRequest());

        expect(response.status).toBe(200);

        expect(await response.json()).toEqual(mockLesson);

        expect(generateLesson).toBeCalledWith(input);

    })


    it('should return a 500 status code when an error occurs', async () => {

        generateLesson.mockRejectedValue(new Error('Test error'));

        const response = await POST(createRequest());

        expect(response.status).toBe(500);

        expect(await response.json()).toEqual({
            error: "Something went wrong, please try again later.",
        });

        expect(generateLesson).toBeCalledWith(input);
    })

    it('should return a 500 status code when syntax error occurs at server side', async () => {

        generateLesson.mockRejectedValue(new SyntaxError('Test syntax error'));

        const response = await POST(createRequest());

        expect(response.status).toBe(500);

        expect(await response.json()).toEqual({
            error: "Something went wrong, please try again later.",
        });

        expect(generateLesson).toHaveBeenCalledWith(input);
    })

    it("should return 400 when request input is invalid", async () => {

        const invalidInput = createRequest({ ...input, prompt: 123 });

        const response = await POST(invalidInput);

        expect(response.status).toBe(400);

        expect(generateLesson).not.toHaveBeenCalled();
    });


    it('should return 400 when the request is invalid JSON', async () => {

        const invalidJsonRequest = new Request(
            "http://localhost:3000/api/gemini",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: '{"prompt":',
            }
        );

        const response = await POST(invalidJsonRequest);

        expect(response.status).toBe(400);

        expect(generateLesson).not.toHaveBeenCalled();
    })

    it('should return 400 when the request body is missing part', async () => {
        const invalidJsonRequest = createRequest({ ...input, prompt: undefined });

        const response = await POST(invalidJsonRequest);

        expect(response.status).toBe(400);

        expect(generateLesson).not.toHaveBeenCalled();
    })

})
