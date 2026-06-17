import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/signUp";

export function useRegister() {
    return useMutation({
        mutationFn: ({ email, password }: any) =>
            signUp(email, password),
    });
}