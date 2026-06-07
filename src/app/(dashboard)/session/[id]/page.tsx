import SessionView from "./session-view";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Page({
    params,
}: Props) {
    const { id } = await params;

    return (
        <SessionView
            lessonId={id}
        />
    );
}