import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api/signIn";

type LoginInput = {
    email: string;
    password: string;
};

export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }: LoginInput) => signIn(email, password),
    });
}
