"use client";

import type { ReactNode } from "react";

export default function PreviewClickGuard({ children }: { children: ReactNode }) {
    return (
        <div
            data-template-preview
            onClickCapture={(event) => {
                const target = event.target as HTMLElement | null;
                if (!target) return;
                const blockedTarget = target.closest("a, form");
                if (!blockedTarget) return;
                event.preventDefault();
                event.stopPropagation();
            }}
            onSubmitCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
            }}
        >
            {children}
        </div>
    );
}
