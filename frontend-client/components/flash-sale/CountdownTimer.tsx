'use client';

import { useState, useEffect, useCallback } from 'react';

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

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (
                newTimeLeft.days === 0 &&
                newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 &&
                newTimeLeft.seconds === 0 &&
                !isEnded
            ) {
                setIsEnded(true);
                onEnd?.();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft, isEnded, onEnd]);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

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
            <div className="flex gap-1 font-mono">
                {timeLeft.days > 0 && (
                    <div className="bg-black text-white px-2 py-1 text-center min-w-[40px]">
                        <div className="text-lg font-black">{formatNumber(timeLeft.days)}</div>
                        <div className="text-[8px] uppercase tracking-wider">Days</div>
                    </div>
                )}
                <div className="bg-black text-white px-2 py-1 text-center min-w-[40px]">
                    <div className="text-lg font-black">{formatNumber(timeLeft.hours)}</div>
                    <div className="text-[8px] uppercase tracking-wider">Hrs</div>
                </div>
                <div className="bg-black text-white px-2 py-1 text-center min-w-[40px]">
                    <div className="text-lg font-black">{formatNumber(timeLeft.minutes)}</div>
                    <div className="text-[8px] uppercase tracking-wider">Min</div>
                </div>
                <div className="bg-primary text-white px-2 py-1 text-center min-w-[40px]">
                    <div className="text-lg font-black">{formatNumber(timeLeft.seconds)}</div>
                    <div className="text-[8px] uppercase tracking-wider">Sec</div>
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
                    <div className="text-[10px] uppercase tracking-widest text-white/70">Days</div>
                </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.hours)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/70">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.minutes)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/70">Minutes</div>
            </div>
            <div className="bg-primary border-2 border-primary px-4 py-3 text-center min-w-[70px]">
                <div className="text-3xl font-black text-white">{formatNumber(timeLeft.seconds)}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/90">Seconds</div>
            </div>
        </div>
    );
}
