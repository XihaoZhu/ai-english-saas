const sessions = [
  {
    id: 1,
    scenario: "Job Interview",
    level: "Intermediate",
    profession: "Software Engineer",
    date: "2026-05-20",
  },
  {
    id: 2,
    scenario: "Restaurant Conversation",
    level: "Beginner",
    profession: "Waiter",
    date: "2026-05-18",
  },
  {
    id: 3,
    scenario: "Customer Support",
    level: "Advanced",
    profession: "Customer Service",
    date: "2026-05-16",
  },
];

export default function HistoryPage() {
  return (
    <main className="bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
              History
            </div>
            <h1 className="text-4xl font-bold">Learning History</h1>
            <p className="text-[color:var(--app-muted)]">
              Review your previous AI-generated learning sessions.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[1.75rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{session.scenario}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--app-muted)]">
                    <span>{session.profession}</span>
                    <span>•</span>
                    <span>{session.level}</span>
                    <span>•</span>
                    <span>{session.date}</span>
                  </div>
                </div>

                <button className="h-11 rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] px-5 text-sm font-medium transition hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent)]">
                  Review Session
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
