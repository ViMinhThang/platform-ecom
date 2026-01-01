"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { chatbotService } from "@/lib/services/chatbot-service";
import { ProductSummary } from "@/types/chatbot";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: ProductSummary[];
    timestamp: Date;
}

interface ChatWindowProps {
    onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp bạn tìm kiếm sản phẩm hoặc trả lời các thắc mắc. Bạn đang quan tâm đến sản phẩm nào?",
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
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatbotService.chat({ message: input });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message,
                products: response.products,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Xin lỗi, tôi gặp chút trục trặc kỹ thuật. Bạn vui lòng thử lại sau giây lát nhé!",
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
        <div className="flex flex-col h-[500px] w-[350px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Trợ lý mua sắm AI</h3>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[10px] opacity-80">Trực tuyến</span>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-2 scrollbar-thin scrollbar-thumb-slate-200"
            >
                {messages.map((m) => (
                    <ChatMessage key={m.id} {...m} />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 rounded-tl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-xs text-slate-500 italic">Đang suy nghĩ...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2 relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 h-11 pr-12 rounded-xl focus-visible:ring-primary/30 border-slate-200"
                        disabled={isLoading}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1 top-1 bottom-1 h-9 w-9 rounded-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                    Powered by Gemini 1.5 Flash
                </p>
            </div>
        </div>
    );
};
