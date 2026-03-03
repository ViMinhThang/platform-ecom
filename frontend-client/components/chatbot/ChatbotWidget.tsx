"use client";

import React, { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

export const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <ChatWindow onClose={() => setIsOpen(false)} />
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-none shadow-2xl transition-all duration-300 transform",
                    isOpen ? "bg-slate-800 rotate-90 scale-90" : "bg-primary hover:scale-110 active:scale-95"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-white opacity-40"></span>
                            <span className="relative inline-flex rounded-sm h-4 w-4 bg-primary text-[10px] items-center justify-center font-bold text-white border-2 border-primary">
                                AI
                            </span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    );
};
