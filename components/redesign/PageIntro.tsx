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
  { n: "01", t: "Choose the service", d: "Contact details and service type" },
  { n: "02", t: "Add job details", d: "Load size, pickup address, and access notes" },
  { n: "03", t: "Schedule and review", d: "Window selection and quote review" },
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
          <p>Use the booking flow to enter contact information, job details, pickup address, access notes, schedule window, and quote review.</p>
        </>
      )}
    </DispatchIntroGrid>
  );
}
