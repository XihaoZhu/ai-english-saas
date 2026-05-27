"use client";

import { useState } from "react";

export default function LearnPage() {
  const [result, setResult] = useState<null | {
    conversation: { role: string; text: string }[];
    keywords: string[];
  }>(null);

  function handleGenerate() {
    setResult({
      conversation: [
        { role: "ai", text: "Welcome to today's English practice session." },
        { role: "user", text: "Thank you. I'm ready to begin." },
      ],
      keywords: ["appointment", "schedule", "clarify"],
    });
  }

  return (
    <main className="min-h-screen bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
              Practice
            </div>
            <h1 className="text-4xl font-bold">AI Learning Session</h1>
            <p className="text-[color:var(--app-muted)]">
              Generate personalized English conversation practice.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--app-muted)]">
                Scenario
              </label>
              <input
                placeholder="e.g. Job interview"
                className="w-full rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--app-accent)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--app-muted)]">
                Profession
              </label>
              <select className="w-full rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-4 py-3 outline-none transition focus:border-[color:var(--app-accent)]">
                <option>Software Engineer</option>
                <option>Waiter</option>
                <option>Customer Service</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--app-muted)]">
                Difficulty Level
              </label>
              <select className="w-full rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-4 py-3 outline-none transition focus:border-[color:var(--app-accent)]">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-6 h-12 rounded-xl bg-[color:var(--app-accent)] px-6 font-medium text-white transition hover:opacity-90"
          >
            Generate Session
          </button>
        </section>

        {result && (
          <section className="space-y-6 rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Conversation</h2>
              <div className="space-y-3">
                {result.conversation.map((message, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-4"
                  >
                    <p className="mb-2 text-sm uppercase tracking-wide text-[color:var(--app-muted)]">
                      {message.role}
                    </p>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Keywords</h2>
              <div className="flex flex-wrap gap-3">
                {result.keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="rounded-full border border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] px-4 py-2 text-sm text-[color:var(--app-text)]"
                  >
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
