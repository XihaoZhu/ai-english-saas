import SessionView from "./session-view";
import { getLesson } from "@/src/features/lessons/api/getLesson";

export default async function SessionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const lesson = await getLesson(id);

    return <SessionView lesson={lesson} />;
}
