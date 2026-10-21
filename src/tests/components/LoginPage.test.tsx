// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import userEvent from "@testing-library/user-event";

import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

import LoginPage from "@/src/app/(auth)/login/page";



vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock("@/src/features/auth/hooks/useLogin", () => ({
    useLogin: () => ({
        isPending: false,
        isError: false,
        error: null,
        mutateAsync: mutateAsync,
    }),
}));

const { mutateAsync } = vi.hoisted(() => ({
    mutateAsync: vi.fn(),
}));

describe("LoginPage", () => {

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    })

    it("should render the login form", () => {

        render(<LoginPage />);

        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    });

    it("should display error message when login email is invalid", async () => {

        render(<LoginPage />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Email"), "invalid-email");

        await user.type(screen.getByPlaceholderText("Password"), "password123");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Invalid email")).toBeInTheDocument();

        expect(mutateAsync).not.toHaveBeenCalled();

    })
})