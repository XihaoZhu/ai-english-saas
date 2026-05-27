import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
    },
    {
        href: "/learn",
        label: "Learn",
    },
    {
        href: "/history",
        label: "History",
    },
    {
        href: "/settings",
        label: "Settings",
    },
];

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[color:var(--app-bg)] text-[color:var(--app-text)]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] p-6 backdrop-blur md:block">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold">
                        EnglishAI
                    </h1>

                    <p className="mt-2 text-sm text-[color:var(--app-muted)]">
                        AI Learning SaaS
                    </p>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-xl px-4 py-3 text-[color:var(--app-muted)] transition hover:bg-[color:var(--app-accent-soft)] hover:text-[color:var(--app-text)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] px-6 backdrop-blur">
                    <div>
                        <h2 className="font-medium">
                            AI English Learning Platform
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                    </div>
                </header>

                {/* Page */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
