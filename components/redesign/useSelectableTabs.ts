"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

/** One keyboard stop for a tab set; arrow keys select and focus adjacent tabs. */
export function useSelectableTabs(count: number, initial = 0, orientation: "horizontal" | "vertical" = "horizontal") {
    const id = useId();
    const [selection, select] = useState(initial);
    const buttons = useRef<Array<HTMLButtonElement | null>>([]);
    const active = Math.max(0, Math.min(selection, count - 1));
    const panelId = `${id}-panel`;
    const tabId = (index: number) => `${id}-tab-${index}`;
    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const previous = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
        const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        let target: number;
        if (event.key === previous) target = (index - 1 + count) % count;
        else if (event.key === next) target = (index + 1) % count;
        else if (event.key === "Home") target = 0;
        else if (event.key === "End") target = count - 1;
        else return;
        if (count === 0) return;
        event.preventDefault();
        select(target);
        buttons.current[target]?.focus();
    };
    return { active, select, panelId, tabId, tabProps: (index: number) => ({
        id: tabId(index),
        "aria-selected": index === active,
        "aria-controls": panelId,
        tabIndex: index === active ? 0 : -1,
        ref: (element: HTMLButtonElement | null) => { buttons.current[index] = element; },
        onClick: () => select(index),
        onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => onKeyDown(event, index),
    }) };
}
