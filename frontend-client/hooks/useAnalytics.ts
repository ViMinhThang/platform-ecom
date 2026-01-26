'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { analyticsService, EventType, TrackingEvent } from '@/lib/services/analytics-service';

export const useAnalytics = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.id) {
            analyticsService.setUserId(Number(session.user.id));
        } else {
            analyticsService.setUserId(null);
        }
    }, [session]);

    const trackEvent = (event: Omit<TrackingEvent, 'timestamp' | 'userId' | 'sessionId'>) => {
        analyticsService.track(event);
    };

    const trackProductView = (productId: number, variantId?: number, categoryId?: number, sellerId?: number) => {
        trackEvent({
            eventType: EventType.PRODUCT_VIEW,
            productId,
            variantId,
            categoryId,
            sellerId,
        });
    };

    const trackProductClick = (productId: number, sourceContext: string, categoryId?: number) => {
        trackEvent({
            eventType: EventType.PRODUCT_CLICK,
            productId,
            sourceContext,
            categoryId,
        });
    };

    const trackAddToCart = (productId: number, variantId: number, quantity: number, price: number) => {
        trackEvent({
            eventType: EventType.ADD_TO_CART,
            productId,
            variantId,
            quantity,
            price,
        });
    };

    return {
        trackEvent,
        trackProductView,
        trackProductClick,
        trackAddToCart,
        EventType,
    };
};
