// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import userEvent from "@testing-library/user-event";

import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

import LoginPage from "@/src/app/(auth)/login/page";




const { mutateAsyncLogin, fakePush, useLoginMock } = vi.hoisted(() => ({
    mutateAsyncLogin: vi.fn(),
    fakePush: vi.fn(),
    useLoginMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: fakePush,
    }),
}));

vi.mock("@/src/features/auth/hooks/useLogin", () => ({
    useLogin: useLoginMock,
}));


describe("LoginPage", () => {

    beforeEach(() => {
        useLoginMock.mockReturnValue({
            isPending: false,
            isError: false,
            error: null,
            mutateAsync: mutateAsyncLogin,
        });
    })

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

        expect(mutateAsyncLogin).not.toHaveBeenCalled();

    })

    it("should navigate to dashboard after successful login", async () => {
        render(<LoginPage />);

        const user = userEvent.setup();

        mutateAsyncLogin.mockResolvedValueOnce({ success: true });

        await user.type(screen.getByPlaceholderText("Email"), "valid@email.com");
        await user.type(screen.getByPlaceholderText("Password"), "password123");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mutateAsyncLogin).toHaveBeenCalledWith({
            email: "valid@email.com",
            password: "password123",
        });

        await waitFor(() => {
            expect(fakePush).toHaveBeenCalledWith("/dashboard");
        });

        expect(mutateAsyncLogin).toHaveBeenCalledOnce();
    });


    it("should disable the login button while logging in", () => {

        useLoginMock.mockReturnValue({
            isPending: true,
            isError: false,
            error: null,
            mutateAsync: mutateAsyncLogin,
        });

        render(<LoginPage />);

        const loginButton = screen.getByRole("button", { name: "Logging in..." });

        expect(loginButton).toBeDisabled();
    });

    it("should display error message when login fails", async () => {

        useLoginMock.mockReturnValue({
            isPending: false,
            isError: true,
            error: new Error('Invalid credentials'),
            mutateAsync: mutateAsyncLogin,
        });

        render(<LoginPage />);


        expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();


    })
})