import { useMutation } from "@tanstack/react-query";
import { generateLesson } from "@/src/features/learning/api/generateLesson";

export function useGenerateLesson() {
    return useMutation({
        mutationFn: generateLesson,
    });
}
