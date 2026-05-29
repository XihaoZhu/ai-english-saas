import { useMutation } from "@tanstack/react-query";
import { generateLesson } from "../api/generateLesson";

export function useGenerateLesson() {
    return useMutation({
        mutationFn: generateLesson,
    });
}