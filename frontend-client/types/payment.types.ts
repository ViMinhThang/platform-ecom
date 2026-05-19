export interface PaymentIntent {
    id: string;
    clientSecret: string;
    status: string;
    amount: number;
    currency: string;
}

export interface RefundRequest {
    reason: string;
}
