import { createClient } from "@/src/lib/supabase/server-client";

export async function getLessons(page = 1, pageSize = 5) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            lessons: [],
            totalCount: 0,
            page,
            pageSize,
        };
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
        .from("lessons")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        lessons: data ?? [],
        totalCount: count ?? 0,
        page,
        pageSize,
    };
}
