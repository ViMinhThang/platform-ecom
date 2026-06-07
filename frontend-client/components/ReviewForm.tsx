"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ReviewRichTextEditor } from "./review/ReviewRichTextEditor";
import { ReviewImageUploader } from "./review/ReviewImageUploader";
import { useReviewForm } from "@/hooks/useReviewForm";

interface ReviewFormProps {
    productId: number;
    orderId?: number;
}

export function ReviewForm({
    productId,
    orderId,
}: ReviewFormProps) {
    const [open, setOpen] = useState(false);
    const [ratingHover, setRatingHover] = useState(0);

    const { form, isSubmitting, onSubmit, session } = useReviewForm({
        productId,
        orderId,
        onSuccess: () => {
            setOpen(false);
            setRatingHover(0);
        },
    });

    const handleRatingChange = (value: number) => {
        setRatingHover(value);
        form.setValue("rating", value, { shouldValidate: true });
    };

    if (!session) {
        return (
            <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                    Vui lòng đăng nhập để viết đánh giá.
                </p>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Viết đánh giá</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Viết đánh giá</DialogTitle>
                    <DialogDescription>
                        Chia sẻ trải nghiệm của bạn về sản phẩm này.
                    </DialogDescription>
                </DialogHeader>

                <Form form={form}>
                    <div className="space-y-6">
                        {/* Rating Field */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center gap-y-2">
                                    <FormLabel>Đánh giá</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`text-2xl focus:outline-none transition-colors ${star <= (ratingHover || field.value || 0)
                                                            ? "text-primary"
                                                            : "text-gray-300"
                                                        }`}
                                                    onClick={() => handleRatingChange(star)}
                                                    onMouseEnter={() => setRatingHover(star)}
                                                    onMouseLeave={() =>
                                                        setRatingHover(field.value || 0)
                                                    }
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung</FormLabel>
                                    <FormControl>
                                        <ReviewRichTextEditor
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Hãy cho chúng tôi biết bạn thích hoặc không thích điều gì…"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình ảnh thực tế</FormLabel>
                                    <FormControl>
                                        <ReviewImageUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Bạn có thể tải lên tối đa 5 hình ảnh.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Gửi đánh giá
                            </Button>
                        </DialogFooter>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
