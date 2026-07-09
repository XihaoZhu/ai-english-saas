import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/signUp";

type RegisterInput = {
    email: string;
    password: string;
};

export function useRegister() {
    return useMutation({
        mutationFn: ({ email, password }: RegisterInput) => signUp(email, password),
    });
}
