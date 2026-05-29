export default function SettingsPage() {
  return (
    <main className="bg-[color:var(--app-bg)] px-6 py-8 text-[color:var(--app-text)]">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-[color:var(--app-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
              Settings
            </div>
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-[color:var(--app-muted)]">
              Manage your learning preferences.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--app-muted)]">
                Preferred Difficulty
              </label>
              <select className="w-full rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-4 py-3 outline-none transition focus:border-[color:var(--app-accent)]">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--app-muted)]">
                Daily Learning Goal
              </label>
              <input
                placeholder="30 minutes"
                className="w-full rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--app-accent)]"
                type='number'
                min="0"
              />
            </div>

            <button className="h-12 rounded-xl bg-[color:var(--app-accent)] px-6 font-medium text-white transition hover:opacity-90">
              Save Settings
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
