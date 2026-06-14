import { createClient } from "@/src/lib/supabase/browser-client";

export async function signUp(
    email: string,
    password: string
) {
    const supabase = createClient();

    const { data, error } =
        await supabase.auth.signUp({
            email,
            password,
        });

    if (error) {
        throw error;
    }

    return data;
}