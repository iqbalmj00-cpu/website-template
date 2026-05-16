import { DispatchSiteFooter } from "@/components/redesign/DispatchBlocks";

export default function Footer(_props: { showReviews?: boolean } = {}) {
    return <DispatchSiteFooter showReviews={_props.showReviews} />;
}
