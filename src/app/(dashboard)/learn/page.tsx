"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLessonStore } from "@/src/store/useLessonStore";

import {
  lessonSchema,
  LessonForm,
} from "@/src/features/learning/schema/lessonSchema";

import { useGenerateLesson } from "@/src/features/learning/hooks/useGenerateLesson";

export default function LearnPage() {
  const router = useRouter();

  const mutation = useGenerateLesson();

  const form = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      scenario: "",
      profession: "Software Engineer",
      level: "Beginner",
    },
  });

  const addLesson =
    useLessonStore((state) => state.addLesson);

  async function onSubmit(data: LessonForm) {
    try {
      const lesson = await mutation.mutateAsync(data);

      addLesson(lesson);

      router.push(`/session/${lesson.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className=" bg-[color:var(--app-bg)] text-[color:var(--app-text)] p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold">
          Create Learning Session
        </h1>

        <p className="mb-8 opacity-70">
          Generate a personalized English lesson.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-3xl border border-[color:var(--app-border)] p-6"
        >
          <div>
            <label className="mb-2 block text-sm">
              Scenario
            </label>

            <input
              {...form.register("scenario")}
              placeholder="e.g. Job Interview"
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            />

            {form.formState.errors.scenario && (
              <p className="mt-2 text-sm text-red-500">
                {form.formState.errors.scenario.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Profession
            </label>

            <input
              {...form.register("profession")}
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Level
            </label>

            <select
              {...form.register("level")}
              className="w-full rounded-xl border border-[color:var(--app-border)] bg-transparent px-4 py-3"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
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