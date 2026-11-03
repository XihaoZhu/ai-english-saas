// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { vi, describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import LoginPage from "@/src/app/(auth)/login/page";

const createQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            mutations: {
                retry: false,
            },
            queries: {
                retry: false,
            },
        },
    });
}

vi.mock("@/src/features/auth/api/signIn.ts", () => ({
    signIn: mockSignIn
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: fakePush,
    }),
}));

const { mockSignIn, fakePush } = vi.hoisted(() => ({
    mockSignIn: vi.fn(),
    fakePush: vi.fn(),
}));


describe("LoginPage", () => {

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    })

    it("should render login form with real useLogin hook", () => {

        const queryClient = createQueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("should disable login button while signIn is pending", async () => {


        let resolveLogin!: (value: unknown) => void;

        const pendingLogin = new Promise((resolve, reject) => {
            resolveLogin = resolve
        })

        mockSignIn.mockReturnValue(pendingLogin);

        const queryClient = createQueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Password"), "password");

        await user.click(screen.getByRole("button", { name: "Login" }));

        const loginButton = await screen.findByRole("button", {
            name: "Logging in...",
        });

        expect(loginButton).toBeDisabled();

        expect(mockSignIn).toHaveBeenCalledWith(
            "test@example.com",
            "password"
        );

        resolveLogin({ user: { id: "123" }, success: true });

        await waitFor(() => {
            expect(fakePush).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("should display error message when signIn fails", async () => {


        mockSignIn.mockRejectedValue(new Error("Invalid credentials"));

        const queryClient = createQueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <LoginPage />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Password"), "password");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

        expect(mockSignIn).toHaveBeenCalledWith(
            "test@example.com",
            "password"
        );

        expect(fakePush).not.toHaveBeenCalled();
    });

})