'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2, Truck, Package, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGetGhnTrackingQuery } from '@/lib/store/api/clientApi';

interface TrackingEvent {
    status: string;
    status_name?: string;
    updated_date: string;
    location?: {
        address?: string;
    };
}

interface TrackingTimelineProps {
    ghnOrderCode: string;
}

export function TrackingTimeline({ ghnOrderCode }: TrackingTimelineProps) {
    const { data: trackingData, isLoading: loading, error: queryError } = useGetGhnTrackingQuery(ghnOrderCode, {
        skip: !ghnOrderCode,
    });
    const tracking = trackingData ? { code: 200, message: '', data: trackingData } : null;
    const error = queryError ? 'Không thể tải thông tin theo dõi' : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
                <AlertCircle className="size-5" />
                <span>{error}</span>
            </div>
        );
    }

    if (!tracking?.data?.log || tracking.data.log.length === 0) {
        return (
            <div className="text-muted-foreground py-4">
                Chưa có thông tin theo dõi.
            </div>
        );
    }

    const events = tracking.data.log.slice().reverse(); // Most recent first

    const getStatusIcon = (status: string, isLatest: boolean) => {
        const iconClass = isLatest
            ? 'size-5 text-primary'
            : 'size-5 text-muted-foreground';

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
                    ? <Circle className="size-5 fill-primary text-primary" />
                    : <Circle className="size-5 text-muted-foreground" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'ready_to_pick': 'Sẵn sàng lấy hàng',
            'picking': 'Nhân viên đang lấy hàng',
            'picked': 'Đã lấy hàng',
            'storing': 'Đang ở kho GHN',
            'transporting': 'Đang vận chuyển',
            'sorting': 'Đang phân loại',
            'delivering': 'Đang giao hàng',
            'delivered': 'Đã giao hàng',
            'delivery_fail': 'Giao hàng thất bại',
            'waiting_to_return': 'Đang chờ hoàn hàng',
            'returning': 'Đang hoàn hàng',
            'returned': 'Đã hoàn hàng',
            'cancel': 'Đã hủy',
        };
        return labels[status.toLowerCase()] || status.replace(/_/g, ' ');
    };

    function EstimatedDeliveryDate({ leadtime }: { leadtime: string }) {
        const [displayDate, setDisplayDate] = useState("");
        useEffect(() => {
            setDisplayDate(format(new Date(leadtime), 'dd/MM/yyyy', { locale: vi }));
        }, [leadtime]);
        return (
            <p className="text-sm font-medium">
                Dự kiến giao hàng: {displayDate}
            </p>
        );
    }

    function EventDate({ updatedDate }: { updatedDate: string }) {
        const [displayDate, setDisplayDate] = useState("");
        useEffect(() => {
            setDisplayDate(format(new Date(updatedDate), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi }));
        }, [updatedDate]);
        return (
            <p className="text-xs text-muted-foreground mt-1">
                {displayDate}
            </p>
        );
    }

    return (
        <div className="space-y-0">
            {/* Dự kiến giao hàng */}
            {tracking.data.leadtime && (
                <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <EstimatedDeliveryDate leadtime={tracking.data.leadtime} />
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                {events.map((event, index) => {
                    const isLatest = index === 0;
                    const isLast = index === events.length - 1;

                    return (
                        <div key={"timeline-" + index} className="flex gap-4 pb-6 last:pb-0">
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
                                        <MapPin className="size-3" />
                                        {event.location.address}
                                    </p>
                                )}
                                <EventDate updatedDate={event.updated_date} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
