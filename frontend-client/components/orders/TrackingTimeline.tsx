'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2, Truck, Package, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TrackingEvent {
    status: string;
    status_name?: string;
    updated_date: string;
    location?: {
        address?: string;
    };
}

interface GhnTrackingResponse {
    code: number;
    message: string;
    data?: {
        status: string;
        log: TrackingEvent[];
        leadtime?: string;
    };
}

interface TrackingTimelineProps {
    ghnOrderCode: string;
}

export function TrackingTimeline({ ghnOrderCode }: TrackingTimelineProps) {
    const [tracking, setTracking] = useState<GhnTrackingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTracking() {
            if (!ghnOrderCode) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': process.env.NEXT_PUBLIC_GHN_TOKEN || '',
                    },
                    body: JSON.stringify({ order_code: ghnOrderCode }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tracking info');
                }

                const data: GhnTrackingResponse = await response.json();

                if (data.code !== 200) {
                    throw new Error(data.message || 'Failed to get tracking info');
                }

                setTracking(data);
            } catch (err: any) {
                setError(err.message || 'Unable to load tracking information');
            } finally {
                setLoading(false);
            }
        }

        fetchTracking();
    }, [ghnOrderCode]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
            </div>
        );
    }

    if (!tracking?.data?.log || tracking.data.log.length === 0) {
        return (
            <div className="text-muted-foreground py-4">
                No tracking information available yet.
            </div>
        );
    }

    const events = tracking.data.log.slice().reverse(); // Most recent first

    const getStatusIcon = (status: string, isLatest: boolean) => {
        const iconClass = isLatest
            ? 'h-5 w-5 text-primary'
            : 'h-5 w-5 text-muted-foreground';

        switch (status.toLowerCase()) {
            case 'delivered':
                return <CheckCircle2 className={`${iconClass} text-green-500`} />;
            case 'delivering':
            case 'transporting':
                return <Truck className={iconClass} />;
            case 'picked':
            case 'picking':
                return <Package className={iconClass} />;
            default:
                return isLatest
                    ? <Circle className="h-5 w-5 fill-primary text-primary" />
                    : <Circle className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'ready_to_pick': 'Ready for Pickup',
            'picking': 'Shipper Picking Up',
            'picked': 'Package Picked Up',
            'storing': 'At GHN Hub',
            'transporting': 'In Transit',
            'sorting': 'At Sorting Facility',
            'delivering': 'Out for Delivery',
            'delivered': 'Delivered',
            'delivery_fail': 'Delivery Failed',
            'waiting_to_return': 'Pending Return',
            'returning': 'Being Returned',
            'returned': 'Returned',
            'cancel': 'Cancelled',
        };
        return labels[status.toLowerCase()] || status.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-0">
            {/* Estimated Delivery */}
            {tracking.data.leadtime && (
                <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">
                        Estimated Delivery: {format(new Date(tracking.data.leadtime), 'MMM d, yyyy')}
                    </p>
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                {events.map((event, index) => {
                    const isLatest = index === 0;
                    const isLast = index === events.length - 1;

                    return (
                        <div key={index} className="flex gap-4 pb-6 last:pb-0">
                            {/* Timeline Line & Icon */}
                            <div className="flex flex-col items-center">
                                {getStatusIcon(event.status, isLatest)}
                                {!isLast && (
                                    <div className="w-0.5 flex-1 bg-muted mt-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 pb-2 ${isLatest ? '' : 'opacity-70'}`}>
                                <p className={`font-medium ${isLatest ? 'text-primary' : ''}`}>
                                    {event.status_name || getStatusLabel(event.status)}
                                </p>
                                {event.location?.address && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location.address}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(event.updated_date), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
