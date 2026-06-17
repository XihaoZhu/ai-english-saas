import { redirect } from "next/navigation";
import { getUser } from "@/src/features/auth/api/getUser";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (user) {
        redirect("/dashboard");
    }

    return <>{children}</>;
}