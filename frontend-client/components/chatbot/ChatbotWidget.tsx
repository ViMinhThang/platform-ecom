"use client";

import React, { useState } from "react";
import { MessageCircle, X, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

export const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-6">
            {/* Chat Window */}
            {isOpen && (
                <ChatWindow onClose={() => setIsOpen(false)} />
            )}

            {/* TOGGLE BUTTON: ARCHIVAL TRIGGER */}
            <div className="relative group">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "size-16 rounded-[4px] shadow-2xl transition-all duration-500 border border-white/10 ring-1 ring-primary/20",
                        isOpen 
                            ? "bg-foreground rotate-90 scale-90" 
                            : "bg-primary hover:bg-primary/90 hover:-translate-y-1 active:scale-95"
                    )}
                >
                    {isOpen ? (
                        <X className="size-6 text-white" />
                    ) : (
                        <div className="relative flex items-center justify-center">
                            <Zap className="size-8 text-white fill-current" />
                            {/* LIVE AI BADGE */}
                            <div className="absolute -top-3 -right-3 flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-white opacity-40"></span>
                                <div className="relative bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm tracking-widest font-labels border border-primary/10">
                                    TL
                                </div>
                            </div>
                        </div>
                    )}
                </Button>
                
                {!isOpen && (
                    <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-white border border-foreground/10 px-4 py-2 rounded-[2px] shadow-xl">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 font-labels">HỖ TRỢ THÔNG MINH</span>
                    </div>
                )}
</div>
        </div>
    );
};
