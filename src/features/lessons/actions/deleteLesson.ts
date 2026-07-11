"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server-client";

export async function deleteLesson(lessonId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId)
        .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/history");
    revalidatePath(`/session/${lessonId}`);
}
