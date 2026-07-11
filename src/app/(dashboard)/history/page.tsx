import { getLessons } from "@/src/features/lessons/api/getLessons";
import Link from "next/link";
import DeleteLessonButton from "./DeleteLessonButton";

const PAGE_SIZE = 5;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? "1") || 1);
  const { lessons, totalCount } = await getLessons(currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const showPagination = totalPages > 1;

  const pageLink = (page: number) =>
    page === 1 ? "/history" : `/history?page=${page}`;

  return (
    <main className="bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
              History
            </div>
            <h1 className="text-4xl font-bold">Reading History</h1>
            <p className="text-[color:var(--app-muted)]">
              Review your previous AI-generated reading passages.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {lessons.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-6 py-10 text-center text-sm text-[color:var(--app-muted)]">
              No reading history yet.
            </div>
          )}
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-[1.75rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{lesson.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--app-muted)]">
                    <span>{lesson.level}</span>
                    <span>·</span>
                    <span>{lesson.length}</span>
                    <span>·</span>
                    <span>{lesson.word_count} words</span>
                  </div>
                  <p className="max-w-3xl text-sm text-[color:var(--app-muted)]">
                    {lesson.prompt}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                  <Link
                    href={`/session/${lesson.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] px-5 text-sm font-medium transition hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent)]"
                  >
                    Review Passage
                  </Link>

                  <DeleteLessonButton
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                    currentPage={safePage}
                    itemsOnPage={lessons.length}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {showPagination && (
          <section className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-5 py-4">
            <p className="text-sm text-[color:var(--app-muted)]">
              Page {safePage} of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={pageLink(Math.max(1, safePage - 1))}
                aria-disabled={safePage === 1}
                className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition ${safePage === 1
                    ? "pointer-events-none border-[color:var(--app-border)] text-[color:var(--app-muted)] opacity-50"
                    : "border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent)]"
                  }`}
              >
                Previous
              </Link>
              <Link
                href={pageLink(Math.min(totalPages, safePage + 1))}
                aria-disabled={safePage === totalPages}
                className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition ${safePage === totalPages
                    ? "pointer-events-none border-[color:var(--app-border)] text-[color:var(--app-muted)] opacity-50"
                    : "border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent)]"
                  }`}
              >
                Next
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
