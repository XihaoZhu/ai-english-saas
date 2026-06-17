"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  registerSchema,
  RegisterForm,
} from "@/src/features/auth/schema/authSchema";

import { useRegister } from "@/src/features/auth/hooks/useRegister";

import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    try {
      await register.mutateAsync(data);
      router.push("/dashboard");
    } catch (e) {
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--app-bg)] text-[color:var(--app-text)]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left */}
        <section className="hidden lg:flex border-r border-[color:var(--app-border)]">
          <div className="hidden lg:flex flex-col justify-between p-10">
            <div>
              <div className="mb-6 text-4xl font-bold">
                SpeakFlow
              </div>

              <p className="max-w-sm text-lg opacity-70">
                Improve your English through
                AI-powered conversation practice,
                personalized lessons and progress tracking.
              </p>
            </div>

            <div className="opacity-50 text-sm">
              Built with Next.js, Supabase and AI
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="flex items-center justify-center p-8 flex-col gap-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[400px] space-y-4 rounded-2xl border border-[color:var(--app-border)] p-6"
          >
            <h1 className="text-2xl font-bold">Register</h1>

            <input
              placeholder="Email"
              {...form.register("email")}
              className="w-full border border-[color:var(--app-border)] p-3 rounded"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.email?.message}
            </p>

            <input
              type="password"
              placeholder="Password"
              {...form.register("password")}
              className="w-full border border-[color:var(--app-border)] p-3 rounded"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.password?.message}
            </p>

            {register.isError && (
              <p className="text-red-500 text-sm">
                {(register.error as Error).message}
              </p>
            )}

            <button
              disabled={register.isPending}
              className="w-full bg-[color:var(--app-text)] text-[color:var(--app-bg)] p-3 rounded"
            >
              {register.isPending
                ? "Creating..."
                : "Create Account"}
            </button>
          </form>
          <p className="text-sm opacity-70">
            Already have an account?
            <Link
              href="/login"
              className="ml-1 underline"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>

  );
}