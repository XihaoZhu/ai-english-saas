"use client";

import { useMemo, useState } from "react";
import type { Lesson, ReadingWord } from "@/src/features/lessons/types/lesson";

export default function SessionView({
    lesson,
}: {
    lesson: Lesson;
}) {
    const [activeWord, setActiveWord] = useState<ReadingWord | null>(null);

    const articleWords = useMemo(() => {
        return lesson.article.split(/\s+/);
    }, [lesson.article]);

    const wordMap = useMemo(() => {
        return new Map(
            lesson.vocabulary.map((entry) => [entry.word.toLowerCase(), entry])
        );
    }, [lesson.vocabulary]);

    return (
        <main className="bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
            <div className="mx-auto max-w-5xl space-y-8">
                <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] flex justify-between items-center gap-6">
                    <div className="space-y-3 flex-1 text-center">
                        <h1 className="text-4xl font-bold">{lesson.title}</h1>
                    </div>
                    <div className="space-y-3">
                        <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
                            Reading Material
                        </div>
                        <p className="max-w-3xl text-[color:var(--app-muted)]">
                            Level {lesson.level} · {lesson.length} · {lesson.word_count} words
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                    <article className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 leading-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] h-[60vh] overflow-y-auto">
                        <p className="text-[1.05rem] text-[color:var(--app-text)]">
                            {articleWords.map((part, index) => {
                                const normalized = part.replace(/[.,!?;:()]/g, "");
                                const word = wordMap.get(normalized.toLowerCase());

                                if (!word) {
                                    return <span key={`${part}-${index}`}>{part} </span>;
                                }

                                const tierStyles = {
                                    core: "bg-[color:var(--app-tier-core-bg)] text-[color:var(--app-tier-core-text)] ring-[color:var(--app-tier-core-ring)]",
                                    reinforce: "bg-[color:var(--app-tier-reinforce-bg)] text-[color:var(--app-tier-reinforce-text)] ring-[color:var(--app-tier-reinforce-ring)]",
                                    next: "bg-[color:var(--app-tier-next-bg)] text-[color:var(--app-tier-next-text)] ring-[color:var(--app-tier-next-ring)]",
                                };

                                return (
                                    <span
                                        key={`${part}-${index}`}
                                        className="relative inline-block"
                                        onMouseEnter={() => setActiveWord(word)}
                                        onMouseLeave={() => setActiveWord(null)}
                                    >
                                        <button
                                            type="button"
                                            className={`rounded-md px-1 py-0.5 text-inherit ring-1 transition hover:-translate-y-0.5 hover:brightness-95 ${tierStyles[word.tier]}`}
                                        >
                                            {part}
                                        </button>
                                    </span>
                                );
                            })}
                        </p>
                    </article>

                    <aside className="space-y-6">
                        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                            <h2 className="mb-4 text-xl font-semibold">Hover detail</h2>
                            {activeWord ? (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-2xl font-bold">{activeWord.word}</span>
                                        <span className="rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-sm font-medium text-[color:var(--app-accent)]">
                                            {activeWord.phonetic}
                                        </span>
                                    </div>
                                    <p className="text-[color:var(--app-muted)]">{activeWord.meaning}</p>
                                    <p className="text-sm text-[color:var(--app-text)]">{activeWord.explanation}</p>
                                </div>
                            ) : (
                                <p className="text-[color:var(--app-muted)]">
                                    Move your mouse over a highlighted word to see its phonetic transcription and English definition.
                                </p>
                            )}
                        </section>
                    </aside>
                </section>
            </div>
        </main>
    );
}
