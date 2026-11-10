import { POST } from "@/src/app/api/gemini/route";
import type { GeneratedLessonResult, LessonDraftInput } from "@/src/features/lessons/types/lesson";
import { LessonTimeoutError } from "@/src/lib/ai/gemini";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";


const { generateLesson, createClient } = vi.hoisted(() => ({
    generateLesson: vi.fn(),
    createClient: vi.fn(),
}));

vi.mock("@/src/lib/ai/gemini", async (importOriginal) => {
    const actual = await importOriginal<
        typeof import("@/src/lib/ai/gemini")
    >();

    return {
        ...actual,
        generateLesson,
    };
});

vi.mock("@/src/lib/supabase/server-client", () => {
    return { createClient }
})



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
        createClient.mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({
                    data: {
                        user: {
                            id: "test-user-id",
                        },
                    },
                    error: null
                })
            }
        })
    });

    afterEach(() => {
        vi.restoreAllMocks();
    })


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
            requestId: expect.stringMatching(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            ),
        });

        expect(generateLesson).toBeCalledWith(input);
    })

    it('should return a 500 status code when syntax error occurs at server side', async () => {

        generateLesson.mockRejectedValue(new SyntaxError('Test syntax error'));

        const response = await POST(createRequest());

        expect(response.status).toBe(500);

        expect(await response.json()).toEqual({
            error: "Something went wrong, please try again later.",
            requestId: expect.stringMatching(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            ),
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

    it('should return correct requestId in the error response when an error occurs', async () => {

        vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-request-id');

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        generateLesson.mockRejectedValue(new Error('Test error'));

        const response = await POST(createRequest());

        expect(await response.json()).toEqual({
            error: "Something went wrong, please try again later.",
            requestId: 'test-request-id',
        });

        expect(consoleSpy.mock.calls[0][0]).toContain('test-request-id');

    })

    it("should return 504 when a LessonTimeoutError occurs", async () => {

        generateLesson.mockRejectedValue(new LessonTimeoutError());

        const response = await POST(createRequest());

        expect(response.status).toBe(504);

        expect(await response.json()).toEqual({
            error: "Lesson generation timed out after 20 seconds. Please try again.",
            requestId: expect.stringMatching(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            ),
        });

    })

    it("should return 401 when user is null and gemini won't be called", async () => {
        createClient.mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({
                    data: {
                        user: null,
                    },
                    error: null
                })
            }
        })

        const response = await POST(createRequest());

        expect(response.status).toBe(401);

        expect(await response.json()).toEqual({
            error: "Unauthorized",
        });

        expect(generateLesson).not.toHaveBeenCalled();

    })

    it("should return 500 when getUser throws an error", async () => {
        createClient.mockResolvedValue({
            auth: {
                getUser: vi.fn().mockRejectedValue(new SyntaxError("Failed to authenticate user")),
            }
        })

        vi.spyOn(console, 'error').mockImplementation(() => { });

        const response = await POST(createRequest());

        expect(response.status).toBe(500);

        expect(await response.json()).toEqual({
            error: "Failed to authenticate user",
        });

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Failed to authenticate user"));
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("SyntaxError"));

        expect(generateLesson).not.toHaveBeenCalled();
    })

    it("should return 500 when user is null and error status from supabase client is 500", async () => {
        createClient.mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({
                    data: {
                        user: null,
                    },
                    error: {
                        status: 500,
                        message: "Internal Server Error",
                    }
                })
            }
        })

        const response = await POST(createRequest());

        expect(response.status).toBe(500);

        expect(await response.json()).toEqual({
            error: "Failed to authenticate user",
        });

        expect(generateLesson).not.toHaveBeenCalled();
    })

})
