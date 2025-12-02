import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

export const createPaymentElements = async (
    clientSecret: string
): Promise<StripeElements | null> => {
    const stripe = await getStripe();
    if (!stripe) return null;

    return stripe.elements({
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#0070f3',
            }
        }
    });
};
