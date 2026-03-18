import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
    try {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const connectAccountId = process.env.STRIPE_CONNECT_ACCOUNT_ID;

        if (!stripeSecretKey) {
            console.error("SetupIntent: missing STRIPE_SECRET_KEY");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

        // Create SetupIntent on the client's connected Stripe account
        const setupIntent = await stripe.setupIntents.create(
            {
                payment_method_types: ["card"],
            },
            connectAccountId ? { stripeAccount: connectAccountId } : undefined,
        );

        return NextResponse.json({
            clientSecret: setupIntent.client_secret,
            connectedAccountId: connectAccountId || null,
        });
    } catch (err) {
        console.error("SetupIntent error:", err);
        return NextResponse.json({ error: "Failed to create setup intent" }, { status: 500 });
    }
}
