"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Loader2, Zap, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { chatbotService } from "@/lib/services/chatbot-service";
import { ProductSummary } from "@/types/chatbot";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: ProductSummary[];
    showSupportInfo?: boolean;
    timestamp: Date;
}

interface ChatWindowProps {
    onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const [conversationId] = useState(() => uuidv4());
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "KÍNH CHÀO QUÝ KHÁCH. HỆ THỐNG AI ACME ĐÃ SẴN SÀNG. Tôi có thể hỗ trợ quý khách thực hiện truy xuất hồ sơ vật phẩm hoặc giải đáp các thắc mắc về di sản trong bộ sưu tập. Quý khách đang quan tâm đến hạng mục lưu trữ nào?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.toUpperCase(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatbotService.chat({ 
                message: input,
                conversationId: conversationId
            });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message,
                products: response.products,
                showSupportInfo: response.showSupportInfo,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "LỖI TRUY XUẤT HỆ THỐNG. Giao dịch tin nhắn gặp trục trặc kỹ thuật. Quý khách vui lòng thử lại sau giây lát hoặc liên hệ ban quản lý.",
                showSupportInfo: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[650px] w-[500px] bg-[#F5F3F4] rounded-[4px] shadow-3xl border border-foreground/10 overflow-hidden animate-in slide-in-from-bottom-8 fade-in-0 duration-500 font-labels">
            {/* DOSSIER HEADER: SCHOLARLY AI */}
            <div className="bg-primary p-6 flex justify-between items-center text-white relative">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                />
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-2 rounded-[2px] border border-white/10">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] font-labels">HỆ THỐNG AI // ACME</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-400 rounded-sm animate-pulse shadow-sm shadow-green-400/50" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">TRỰC TUYẾN</span>
                        </div>
                    </div>
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/10 rounded-[2px] h-10 w-10 relative z-10 transition-all"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* MESSAGE ARCHIVE AREA: DOSSIER CANVAS */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-[#F5F3F4]"
            >
                {messages.map((m) => (
                    <ChatMessage key={m.id} {...m} />
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-[4px] p-5 shadow-sm border border-foreground/5 flex items-center gap-4 animate-in fade-in-0 slide-in-from-left-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 italic">TRUY XUẤT DỮ LIỆU...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* INPUT DOSSIER AREA */}
            <div className="p-6 bg-white border-t border-foreground/5 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/10 to-transparent" />
                
                <div className="flex gap-4 relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="HỎI BẤT CỨ ĐIỀU GÌ..."
                        className="flex-1 h-16 pl-6 pr-20 rounded-[4px] bg-secondary/5 border-foreground/5 focus-visible:ring-primary/20 text-[11px] font-bold uppercase tracking-widest placeholder:text-foreground/20 transition-all font-labels"
                        disabled={isLoading}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 h-12 w-12 rounded-[2px] shadow-lg transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                
                <div className="mt-4 flex items-center justify-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default">
                    <HelpCircle className="w-3 h-3" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.4em]">ACME_REGISTRY_AI_v4.2</span>
                </div>
            </div>
        </div>
    );
};
