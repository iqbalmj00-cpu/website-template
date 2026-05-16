import DispatchSiteHeader from "@/components/redesign/DispatchSiteHeader";

export default function Navbar(props: { showReviews?: boolean } = {}) {
    return <DispatchSiteHeader showReviews={props.showReviews} />;
}
