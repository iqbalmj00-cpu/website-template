import type { Metadata } from "next";
import VolumeEstimatorPreviewClient from "./VolumeEstimatorPreviewClient";

export const metadata: Metadata = {
    title: "Volume Estimator Preview",
    robots: {
        index: false,
        follow: false,
    },
};

export default function VolumeEstimatorPreviewPage() {
    return (
        <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                <VolumeEstimatorPreviewClient />
            </div>
        </main>
    );
}
