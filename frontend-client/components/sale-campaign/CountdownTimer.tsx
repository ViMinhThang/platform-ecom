'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownTimerProps {
    endTime: string | Date;
    onEnd?: () => void;
    variant?: 'banner' | 'card' | 'inline';
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const formatNumber = (num: number) => num.toString().padStart(2, '0');

export function CountdownTimer({ endTime, onEnd, variant = 'banner' }: CountdownTimerProps) {
    const calculateTimeLeft = useCallback((): TimeLeft => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());
    const isEnded = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (
                newTimeLeft.days === 0 &&
                newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 &&
                newTimeLeft.seconds === 0 &&
                !isEnded.current
            ) {
                isEnded.current = true;
                onEnd?.();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft, onEnd]);

    if (variant === 'inline') {
        return (
            <span className="font-mono font-bold text-primary">
                {timeLeft.days > 0 && `${timeLeft.days}d `}
                {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </span>
        );
    }

    if (variant === 'card') {
        return (
            <div className="flex gap-1.5">
                {timeLeft.days > 0 && (
                    <div className="bg-background border border-border text-foreground px-2 py-1.5 text-center min-w-[44px] rounded-sm shadow-sm">
                        <div className="text-lg font-bold tracking-tighter">{formatNumber(timeLeft.days)}</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest opacity-50">Ngày</div>
                    </div>
                )}
                <div className="bg-background border border-border text-foreground px-2 py-1.5 text-center min-w-[44px] rounded-sm shadow-sm">
                    <div className="text-lg font-bold tracking-tighter">{formatNumber(timeLeft.hours)}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-50">Giờ</div>
                </div>
                <div className="bg-background border border-border text-foreground px-2 py-1.5 text-center min-w-[44px] rounded-sm shadow-sm">
                    <div className="text-lg font-bold tracking-tighter">{formatNumber(timeLeft.minutes)}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-50">Phút</div>
                </div>
                <div className="bg-primary/10 border border-primary/20 text-primary px-2 py-1.5 text-center min-w-[44px] rounded-sm shadow-sm">
                    <div className="text-lg font-bold tracking-tighter">{formatNumber(timeLeft.seconds)}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-80">Giây</div>
                </div>
            </div>
        );
    }

    // Banner variant (default)
    return (
        <div className="flex gap-3 font-mono">
            {timeLeft.days > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                    <div className="text-3xl font-black text-white">{formatNumber(timeLeft.days)}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70">Ngày</div>
                </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.hours)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/70">Giờ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.minutes)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/70">Phút</div>
            </div>
            <div className="bg-primary border-2 border-primary px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.seconds)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/90">Giây</div>
            </div>
        </div>
    );
}
