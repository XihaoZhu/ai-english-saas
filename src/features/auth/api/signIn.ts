import { createClient } from "@/src/lib/supabase/browser-client";

export async function signIn(
    email: string,
    password: string
) {
    const supabase = createClient();

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        throw error;
    }

    return data;
}