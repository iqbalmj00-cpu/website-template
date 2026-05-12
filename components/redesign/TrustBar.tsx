import { CheckCircle2 } from "lucide-react";
import { getVerifiableTrustSignals, siteConfig } from "@/lib/siteConfig";

export default function TrustBar() {
    const signals = getVerifiableTrustSignals();

    if (!siteConfig.designConfig.showTrustBar || signals.length === 0) {
        return null;
    }

    return (
        <section className="bg-brand px-5 py-4 text-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {signals.map((label) => (
                    <div key={label} className="inline-flex items-center gap-2 text-sm font-black">
                        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
