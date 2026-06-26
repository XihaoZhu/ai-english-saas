"use client";

import { useMemo, useState } from "react";

type ReadingWord = {
    word: string;
    phonetic: string;
    meaning: string;
    tier: "core" | "reinforce" | "next";
    explanation: string;
};

type Lesson = {
    title: string;
    prompt: string;
    keywords: string;
    length: "Short" | "Medium" | "Long";
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    article: string;
    word_count: number;
    vocabulary: ReadingWord[];
};

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
                <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div className="space-y-3">
                        <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
                            Reading Material
                        </div>
                        <h1 className="text-4xl font-bold">{lesson.title}</h1>
                        <p className="max-w-3xl text-[color:var(--app-muted)]">
                            Level {lesson.level} · {lesson.length} · {lesson.word_count} words
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                    <article className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 leading-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <h2 className="mb-4 text-xl font-semibold">Reading passage</h2>
                        <p className="text-[1.05rem] text-[color:var(--app-text)]">
                            {articleWords.map((part, index) => {
                                const normalized = part.replace(/[.,!?;:()]/g, "");
                                const word = wordMap.get(normalized.toLowerCase());

                                if (!word) {
                                    return <span key={`${part}-${index}`}>{part} </span>;
                                }

                                const tierStyles = {
                                    core: "bg-emerald-100 text-emerald-700 ring-emerald-200",
                                    reinforce: "bg-amber-100 text-amber-700 ring-amber-200",
                                    next: "bg-sky-100 text-sky-700 ring-sky-200",
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
                                            className={`rounded-md px-1 py-0.5 text-inherit ring-1 transition hover:-translate-y-0.5 ${tierStyles[word.tier]}`}
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
                            <h2 className="mb-4 text-xl font-semibold">Keywords</h2>
                            <div className="flex flex-wrap gap-2">
                                {lesson.keywords.split(",").map((keyword) => (
                                    <span
                                        key={keyword.trim()}
                                        className="rounded-full border border-[color:var(--app-border)] px-3 py-1 text-sm"
                                    >
                                        {keyword.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                            <h2 className="mb-4 text-xl font-semibold">Vocabulary focus</h2>
                            <div className="space-y-3">
                                {lesson.vocabulary.map((word) => (
                                    <div
                                        key={word.word}
                                        className="rounded-2xl border border-[color:var(--app-border)] p-4"
                                        onMouseEnter={() => setActiveWord(word)}
                                        onMouseLeave={() => setActiveWord(null)}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-lg font-semibold">{word.word}</span>
                                            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--app-muted)]">
                                                {word.tier}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-[color:var(--app-muted)]">
                                            Hover to see phonetic and definition.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </section>

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
            </div>
        </main>
    );
}
