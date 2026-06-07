"use client";

import { useLessonStore } from "@/src/store/useLessonStore";

type Props = {
    lessonId: string;
};

export default function SessionView({
    lessonId,
}: Props) {
    const lesson = useLessonStore(
        (state) =>
            state.lessons.find(
                (l) => l.id === lessonId
            )
    );

    if (!lesson) {
        return (
            <main className="p-6">
                Lesson not found.
            </main>
        );
    }

    return (
        <main className=" bg-[color:var(--app-bg)] text-[color:var(--app-text)] p-6">
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        {lesson.title}
                    </h1>

                    <p className="mt-2 opacity-60">
                        {lesson.level}
                    </p>
                </div>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold">
                        Keywords
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {lesson.keywords.map(
                            (keyword) => (
                                <span
                                    key={keyword}
                                    className="rounded-full border border-[color:var(--app-border)] px-3 py-1"
                                >
                                    {keyword}
                                </span>
                            )
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold">
                        Conversation
                    </h2>

                    <div className="space-y-4">
                        {lesson.conversation.map(
                            (message, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-[color:var(--app-border)] p-4"
                                >
                                    <div className="mb-2 text-xs uppercase opacity-60">
                                        {message.role}
                                    </div>

                                    <div>{message.text}</div>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}