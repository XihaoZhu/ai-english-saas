"use client";

export default function LoadingDots() {
    return (
        <span className="inline-flex ml-1">
            <span className="animate-bounce [animation-delay:-0.3s]">
                .
            </span>

            <span className="animate-bounce [animation-delay:-0.15s]">
                .
            </span>

            <span className="animate-bounce">
                .
            </span>
        </span>
    );
}