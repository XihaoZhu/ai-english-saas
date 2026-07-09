"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  lessonSchema,
  LessonForm,
} from "@/src/features/learning/schema/lessonSchema";

import { createLesson } from "@/src/features/lessons/actions/createLesson";
import { useGenerateLesson } from "@/src/features/learning/hooks/useGenerateLesson";

export default function LearnPage() {
  const router = useRouter();

  const mutation = useGenerateLesson();

  const form = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      prompt: "",
      keywords: "",
      length: "Medium",
      level: "B1",
    },
  });

  async function onGenerate(data: LessonForm) {
    const lesson = await mutation.mutateAsync(data);

    const saved = await createLesson({
      title: lesson.title,
      prompt: lesson.prompt,
      keywords: lesson.keywords,
      length: lesson.length,
      level: lesson.level,
      article: lesson.article,
      word_count: lesson.word_count,
      vocabulary: lesson.vocabulary,
    });

    router.push(`/session/${saved.id}`);
  }

  return (
    <main className=" bg-[color:var(--app-bg)] text-[color:var(--app-text)] p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold">Create Reading Material</h1>

        <p className="mb-8 opacity-70">
          Generate a reading passage from your prompt, keyword focus, length, and CEFR level.
        </p>

        <form
          onSubmit={form.handleSubmit(onGenerate)}
          className="space-y-6 rounded-3xl border border-[color:var(--app-border)] p-6"
        >
          <div>
            <label className="mb-2 block text-sm">Prompt</label>

            <input
              {...form.register("prompt")}
              placeholder="e.g. How to make a good coffee"
              autoComplete="off"
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            />

            {form.formState.errors.prompt && (
              <p className="mt-2 text-sm text-red-500">
                {form.formState.errors.prompt.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm">Additional Information</label>

            <input
              {...form.register("keywords")}
              placeholder="e.g. breakdown guidance, I have a semi-automatic coffee machine"
              autoComplete="off"
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Length</label>

            <select
              {...form.register("length")}
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            >
              <option value="Short">short</option>
              <option value="Medium">medium</option>
              <option value="Long">long</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">Level</label>

            <select
              {...form.register("level")}
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="h-12 w-full rounded-xl bg-[color:var(--app-text)] text-[color:var(--app-bg)]"
          >
            {mutation.isPending
              ? "Generating..."
              : "Generate Lesson"}
          </button>

          {mutation.isError && (
            <p className="text-red-500">
              {(mutation.error as Error).message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
