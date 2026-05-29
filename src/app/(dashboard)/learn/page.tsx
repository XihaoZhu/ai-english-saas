"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { lessonSchema, LessonForm } from "@/src/features/learning/schema/lessonSchema";
import { useGenerateLesson } from "@/src/features/learning/hooks/useGenerateLesson";

export default function LearnPage() {
  const [result, setResult] = useState<any>(null);

  const form = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      scenario: "",
      profession: "Software Engineer",
      level: "Beginner",
    },
  });

  const mutation = useGenerateLesson();

  async function onSubmit(data: LessonForm) {
    try {
      const res = await mutation.mutateAsync(data);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white p-6">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <section>
          <h1 className="text-4xl font-bold">AI Learning Session</h1>
          <p className="text-zinc-500 mt-2">
            Generate structured English practice with AI.
          </p>
        </section>

        {/* FORM */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5"
        >

          {/* Scenario */}
          <div>
            <label className="text-sm">Scenario</label>
            <input
              {...form.register("scenario")}
              className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3"
              placeholder="e.g. Job interview"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.scenario?.message}
            </p>
          </div>

          {/* Profession */}
          <div>
            <label className="text-sm">Profession</label>
            <input
              {...form.register("profession")}
              className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3"
            />
          </div>

          {/* Level */}
          <div>
            <label className="text-sm">Level</label>
            <select
              {...form.register("level")}
              className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* Submit */}
          <button
            disabled={mutation.isPending}
            className="w-full h-12 rounded-xl bg-black text-white dark:bg-white dark:text-black font-medium"
          >
            {mutation.isPending ? "Generating..." : "Generate"}
          </button>

          {/* Error */}
          {mutation.isError && (
            <p className="text-red-500">
              {(mutation.error as Error).message}
            </p>
          )}
        </form>

        {/* RESULT */}
        {result && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Conversation</h2>

            <div className="space-y-3">
              {result.conversation.map((m: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="text-xs text-zinc-500 uppercase">
                    {m.role}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {result.keywords.map((k: string) => (
                  <span
                    key={k}
                    className="px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}