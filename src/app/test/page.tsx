import { supabase } from "@/src/lib/supabase/client";

export default async function TestPage() {
    const { data, error } =
        await supabase
            .from("lessons")
            .select("*");

    console.log(data);
    console.log(error);

    return <div>test</div>;
}