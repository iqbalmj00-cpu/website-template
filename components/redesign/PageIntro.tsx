import type { ReactNode } from "react";
import { DispatchIntroGrid } from "@/components/redesign/DispatchBlocks";

export interface PageIntroRow {
  n: string;
  t: string;
  d: string;
}

interface PageIntroProps {
  eyebrow?: string;
  headline?: string;
  body?: ReactNode;
  rightEyebrow?: string;
  rightHeading?: string;
  rightRows?: PageIntroRow[];
}

const DEFAULT_ROWS: PageIntroRow[] = [
  { n: "01", t: "Tell us what needs to go", d: "Photos, item list, and access notes" },
  { n: "02", t: "Review the quote first", d: "Final price before loading" },
  { n: "03", t: "Crew handles the removal", d: "Lift, load, and haul away" },
];

export default function PageIntro({
  eyebrow = "What this page covers",
  headline = "What it costs, what is included, and what details matter before pickup.",
  body,
  rightEyebrow = "By the numbers",
  rightHeading = "At a glance",
  rightRows = DEFAULT_ROWS,
}: PageIntroProps = {}) {
  return (
    <DispatchIntroGrid
      eyebrow={eyebrow.replace(/^—\s*/, "")}
      heading={headline}
      boardEyebrow={rightEyebrow.replace(/^—\s*/, "")}
      boardHeading={rightHeading}
      rows={rightRows.map((row) => ({ n: row.n, title: row.t, desc: row.d }))}
    >
      {body || (
        <>
          <p>The page explains what can be booked, how quotes are confirmed, and what details can affect the final price before loading begins.</p>
          <p>Share the pickup address, item list, photos when available, and access notes so the job can be scoped clearly.</p>
        </>
      )}
    </DispatchIntroGrid>
  );
}
