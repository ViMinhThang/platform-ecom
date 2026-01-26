import apiClient from '@/lib/api-client';

export enum EventType {
    PRODUCT_VIEW = 'PRODUCT_VIEW',
    PRODUCT_CLICK = 'PRODUCT_CLICK',
    ADD_TO_CART = 'ADD_TO_CART',
    REMOVE_FROM_CART = 'REMOVE_FROM_CART',
    PURCHASE = 'PURCHASE',
    SEARCH = 'SEARCH',
    SEARCH_CLICK = 'SEARCH_CLICK',
    WISHLIST_ADD = 'WISHLIST_ADD',
    WISHLIST_REMOVE = 'WISHLIST_REMOVE',
    CATEGORY_VIEW = 'CATEGORY_VIEW',
    SELLER_VIEW = 'SELLER_VIEW',
    CART_VIEW = 'CART_VIEW',
    CHECKOUT_START = 'CHECKOUT_START',
    CHECKOUT_COMPLETE = 'CHECKOUT_COMPLETE'
}

export interface TrackingEvent {
    eventType: EventType;
    productId?: number;
    variantId?: number;
    categoryId?: number;
    sellerId?: number;
    searchQuery?: string;
    searchPosition?: number;
    referrer?: string;
    sourceContext?: string;
    durationMs?: number;
    quantity?: number;
    price?: number;
    metadata?: Record<string, any>;
    timestamp?: number;
}

class AnalyticsService {
    private queue: TrackingEvent[] = [];
    private flushInterval = 5000;
    private timer: NodeJS.Timeout | null = null;
    private userId: number | null = null;
    private sessionId: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.sessionId = this.getOrCreateSessionId();
            window.addEventListener('beforeunload', () => this.flush());
        }
    }

    setUserId(userId: number | null) {
        this.userId = userId;
    }

    private getOrCreateSessionId(): string {
        let sid = localStorage.getItem('analytics_sid');
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('analytics_sid', sid);
        }
        return sid;
    }

    track(event: Omit<TrackingEvent, 'timestamp' | 'userId' | 'sessionId'>) {
        const fullEvent: TrackingEvent = {
            ...event,
            userId: this.userId || undefined,
            sessionId: this.sessionId || undefined,
            timestamp: Date.now(),
            referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        };

        this.queue.push(fullEvent);

        if (this.queue.length >= 10) {
            this.flush();
        } else if (!this.timer) {
            this.timer = setTimeout(() => this.flush(), this.flushInterval);
        }
    }

    async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (this.queue.length === 0) return;

        const events = [...this.queue];
        this.queue = [];

        try {
            await apiClient.post('/v1/analytics/events/batch', {
                events,
                userId: this.userId,
                sessionId: this.sessionId
            });
        } catch (error) {
            console.error('Failed to flush analytics events', error);
            // Optionally put events back in queue or store in localStorage
        }
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
