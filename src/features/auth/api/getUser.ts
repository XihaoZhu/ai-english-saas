import { createClient } from "@/src/lib/supabase/server-client";

export async function getUser() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}