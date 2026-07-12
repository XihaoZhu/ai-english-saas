import Link from "next/link";
import ThemeToggle from "@/src/components/ui/ThemeToggle";
import { getLessons } from "@/src/features/lessons/api/getLessons";

function formatDate(dateValue: string) {
  return new Date(dateValue).toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const { lessons: recentSessions } = await getLessons(1, 2);

  return (
    <main className="bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
              Dashboard
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="max-w-2xl text-[color:var(--app-muted)]">
              Continue improving your English with AI-generated reading passages.
            </p>
          </div>
          <ThemeToggle />
        </section>

        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-gradient-to-br from-[color:var(--app-surface-strong)] to-[color:var(--app-surface)] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Start a new reading session</h2>
              <p className="max-w-xl text-[color:var(--app-muted)]">
                Generate a reading passage by prompt, length, and CEFR level.
              </p>
            </div>
            <Link
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[color:var(--app-accent)] px-6 font-medium text-white transition hover:opacity-90"
            >
              Start Reading
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Sessions</h2>
            <Link
              href="/history"
              className="text-sm font-medium text-[color:var(--app-muted)] transition hover:text-[color:var(--app-text)]"
            >
              View all
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 text-sm text-[color:var(--app-muted)]">
              No sessions yet. Start one from the learning page.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recentSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className="rounded-2xl border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-[color:var(--app-muted)]">
                      <span>{session.level}</span>
                      <span>{session.length}</span>
                      <span>{formatDate(session.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
