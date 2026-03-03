'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { SaleCampaign, SaleCampaignDiscountTier } from '@/types/sale-campaign';
import { DiscountTierEditor } from './discount-tier-editor';
import { CategoryMultiSelect } from './category-multi-select';
import {
    CalendarIcon,
    InfoIcon,
    TagsIcon,
    PercentIcon,
    ImageIcon,
    XIcon,
} from 'lucide-react';

const saleCampaignSchema = z
    .object({
        name: z.string().min(1, 'Tên chiến dịch là bắt buộc'),
        description: z.string().optional(),
        startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
        endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
        categoryIds: z.array(z.number()).min(1, 'Chọn ít nhất 1 danh mục'),
        discountTiers: z
            .array(
                z.object({
                    minPrice: z.number().min(0),
                    maxPrice: z.number().min(0),
                    discountPercent: z.number().min(1).max(99),
                    sortOrder: z.number().optional(),
                })
            )
            .min(1, 'Thêm ít nhất 1 khung giá giảm'),
    })
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
        message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
        path: ['endTime'],
    });

type SaleCampaignFormValues = z.infer<typeof saleCampaignSchema>;

interface SaleCampaignFormData {
    name: string;
    description?: string;
    bannerUrl?: string;
    startTime: string;
    endTime: string;
    categoryIds: number[];
    discountTiers: SaleCampaignDiscountTier[];
}

interface SaleCampaignFormProps {
    campaign?: SaleCampaign;
    onSubmit: (data: SaleCampaignFormData, bannerFile?: File) => Promise<void>;
    loading?: boolean;
}

export function SaleCampaignForm({ campaign, onSubmit, loading }: SaleCampaignFormProps) {
    const isEditing = !!campaign;
    const [bannerFiles, setBannerFiles] = useState<File[]>([]);
    const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(
        campaign?.bannerUrl || null
    );

    const form = useForm<SaleCampaignFormValues>({
        resolver: zodResolver(saleCampaignSchema),
        defaultValues: {
            name: campaign?.name || '',
            description: campaign?.description || '',
            startTime: campaign?.startTime
                ? new Date(campaign.startTime).toISOString().slice(0, 16)
                : '',
            endTime: campaign?.endTime
                ? new Date(campaign.endTime).toISOString().slice(0, 16)
                : '',
            categoryIds: campaign?.categories?.map((c) => c.categoryId) || [],
            discountTiers: campaign?.discountTiers || [],
        },
    });

    const handleSubmit = async (data: SaleCampaignFormValues) => {
        const requestData: SaleCampaignFormData = {
            name: data.name,
            description: data.description || undefined,
            bannerUrl: existingBannerUrl || undefined,
            startTime: new Date(data.startTime).toISOString(),
            endTime: new Date(data.endTime).toISOString(),
            categoryIds: data.categoryIds,
            discountTiers: data.discountTiers,
        };

        const bannerFile = bannerFiles.length > 0 ? bannerFiles[0] : undefined;
        await onSubmit(requestData, bannerFile);
    };

    const handleRemoveExistingBanner = () => {
        setExistingBannerUrl(null);
    };

    const bannerPreviewUrl =
        bannerFiles.length > 0 ? URL.createObjectURL(bannerFiles[0]) : existingBannerUrl;

    return (
        <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <InfoIcon className="h-5 w-5" />
                                <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
                            </div>
                            <CardDescription>
                                Nhập tên và mô tả cho chiến dịch khuyến mãi của bạn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên chiến dịch</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ví dụ: Holiday Sale 2026, Tech Week..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nhập mô tả ngắn gọn về chương trình..."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Categories Card */}
                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <TagsIcon className="h-5 w-5" />
                                <CardTitle className="text-xl">Danh mục sản phẩm</CardTitle>
                            </div>
                            <CardDescription>
                                Chọn các danh mục sẽ được áp dụng khuyến mãi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="categoryIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CategoryMultiSelect
                                                selectedIds={field.value ?? []}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Discount Tiers Card */}
                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <PercentIcon className="h-5 w-5" />
                                <CardTitle className="text-xl">Khung giá giảm</CardTitle>
                            </div>
                            <CardDescription>
                                Định nghĩa mức giảm giá theo khoảng giá sản phẩm.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="discountTiers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <DiscountTierEditor
                                                tiers={field.value ?? []}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <ImageIcon className="h-5 w-5" />
                                <CardTitle className="text-xl">Banner</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bannerPreviewUrl && (
                                <div className="relative group rounded-lg overflow-hidden border bg-muted">
                                    <Image
                                        src={"http://localhost:8080/uploads/" + bannerPreviewUrl}
                                        alt="Banner preview"
                                        width={400}
                                        height={200}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                handleRemoveExistingBanner();
                                                setBannerFiles([]);
                                            }}
                                        >
                                            <XIcon className="h-4 w-4 mr-2" />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!bannerPreviewUrl && (
                                <FileUploader
                                    value={bannerFiles}
                                    onValueChange={setBannerFiles}
                                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                                    maxSize={5 * 1024 * 1024}
                                    maxFiles={1}
                                />
                            )}

                            <FormDescription>
                                Kích thước đề xuất: 1200x400px
                            </FormDescription>
                        </CardContent>
                    </Card>

                    {/* Schedule Card */}
                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <CalendarIcon className="h-5 w-5" />
                                <CardTitle className="text-xl">Lịch trình</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bắt đầu</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kết thúc</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full font-bold shadow-md"
                        size="lg"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Đang lưu...
                            </div>
                        ) : isEditing ? (
                            'Cập nhật chiến dịch'
                        ) : (
                            'Tạo chiến dịch'
                        )}
                    </Button>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">
                            <InfoIcon className="h-4 w-4" />
                            Lưu ý
                        </h4>
                        <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1 list-disc pl-4">
                            <li>Chiến dịch sẽ ở trạng thái <strong>Nháp</strong> sau khi tạo.</li>
                            <li>Nhấn <strong>Kích hoạt</strong> để áp dụng khuyến mãi.</li>
                            <li>Sản phẩm sẽ được tự động thêm khi kích hoạt.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Form>
    );
}
