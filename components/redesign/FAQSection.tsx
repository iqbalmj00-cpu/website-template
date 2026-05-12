import SectionShell from "./SectionShell";

type FAQ = {
    q: string;
    a: string;
};

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
    return (
        <SectionShell tone="card" align="center" eyebrow="FAQ" title="Junk Removal Questions">
            <div className="mx-auto max-w-3xl space-y-3 text-left">
                {faqs.map((faq) => (
                    <details key={faq.q} className="group rounded-card border border-border bg-background">
                        <summary className="cursor-pointer px-5 py-4 font-black text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand">
                            {faq.q}
                        </summary>
                        <div className="px-5 pb-5 text-sm leading-7 text-muted">{faq.a}</div>
                    </details>
                ))}
            </div>
        </SectionShell>
    );
}
