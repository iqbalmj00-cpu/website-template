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
    tone = "paper-2",
}: StaticFAQProps) {
    if (items.length === 0) return null;

    const bg = tone === "paper" ? "bg-paper" : "bg-paper-2";
    const cardBg = tone === "paper" ? "bg-paper-2" : "bg-paper";

    return (
        <section className={`${bg} py-[100px] px-[clamp(20px,4vw,64px)]`}>
            <div className="mx-auto" style={{ maxWidth: 980 }}>
                <div className="mb-7 text-center">
                    <div className="eyebrow inline-flex">{eyebrow}</div>
                    <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                        {heading}
                    </h2>
                </div>
                <div className={`overflow-hidden rounded-[14px] border border-line ${cardBg}`}>
                    {items.map((faq) => (
                        <details key={faq.q} className="border-b border-line last:border-b-0">
                            <summary className="cursor-pointer px-6 py-5 font-display text-[19px] font-semibold text-ink">
                                {faq.q}
                            </summary>
                            <div className="px-6 pb-6 text-[15.5px] leading-[1.6] text-muted">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
