"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { deleteLesson } from "@/src/features/lessons/actions/deleteLesson";
import LoadingDots from "@/src/components/ui/LoadingDots";

type DeleteLessonButtonProps = {
    lessonId: string;
    lessonTitle: string;
    currentPage: number;
    itemsOnPage: number;
};

export default function DeleteLessonButton({
    lessonId,
    lessonTitle,
    currentPage,
    itemsOnPage,
}: DeleteLessonButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const router = useRouter();
    const canUsePortal = typeof document !== "undefined";

    const handleDelete = async () => {
        startTransition(async () => {
            await deleteLesson(lessonId);

            if (currentPage > 1 && itemsOnPage === 1) {
                router.replace(
                    currentPage === 2 ? "/history" : `/history?page=${currentPage - 1}`
                );
                return;
            }

            router.refresh();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Deleting..." : "Delete"}
            </button>

            {canUsePortal &&
                isConfirmOpen &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-3xl bg-[color:var(--app-surface)] p-8 shadow-xl">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Delete this passage?</h2>
                                <p className="text-sm text-[color:var(--app-muted)]">
                                    Are you sure you want to delete &quot;{lessonTitle}&quot;? This cannot be undone.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(false)}
                                    disabled={isPending}
                                    className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-bg-elevated)] px-5 text-sm font-medium transition hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsConfirmOpen(false);
                                        handleDelete();
                                    }}
                                    disabled={isPending}
                                    className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPending ? (
                                        <span className="inline-flex items-center gap-2">
                                            Deleting
                                            <LoadingDots />
                                        </span>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
