import { redirect } from "next/navigation";
import { getUser } from "@/src/features/auth/api/getUser";

import DashboardShell from "@/src/components/layout/DashboardShell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return <DashboardShell>{children}</DashboardShell>;
}