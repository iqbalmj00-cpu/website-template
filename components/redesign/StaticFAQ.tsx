import { DispatchFaqBoard } from "@/components/redesign/DispatchBlocks";

type StaticFAQItem = {
    q: string;
    a: string;
};

type StaticFAQProps = {
    eyebrow?: string;
    heading: string;
    items: StaticFAQItem[];
    tone?: "paper" | "paper-2";
};

export default function StaticFAQ({
    eyebrow = "FAQ",
    heading,
    items,
}: StaticFAQProps) {
    return <DispatchFaqBoard eyebrow={eyebrow} heading={heading} items={items} />;
}
