import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api/signIn";

export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }: any) =>
            signIn(email, password),
    });
}