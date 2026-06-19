'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Voucher,
    VOUCHER_TYPE_LABELS,
    APPLY_MODE_LABELS,
} from '@/types/voucher';
import { FormInput } from '@/components/admin/form-input';
import { FormSelect, type FormOption } from '@/components/admin/form-select';
import { FormTextarea } from '@/components/admin/form-textarea';

const voucherSchema = z.object({
    name: z.string().min(1, 'Tên mã giảm giá là bắt buộc'),
    code: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'] as const),
    categoryId: z.coerce.number().optional().nullable(),
    applyMode: z.enum(['AUTO', 'CODE_REQUIRED'] as const),
    discountValue: z.number().min(0, 'Giá trị giảm phải >= 0'),
    minOrderAmount: z.number().min(0, 'Đơn tối thiểu phải >= 0').optional(),
    maxDiscountAmount: z.number().min(0, 'Giảm tối đa phải >= 0').optional(),
    usageLimit: z.number().min(0, 'Số lần sử dụng tối đa phải >= 0').optional(),
    usageLimitPerUser: z.number().min(0, 'Số lần sử dụng mỗi người phải >= 0').optional(),
    startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
}).refine((data) => {
    if (!data.startTime || !data.endTime) return true;
    return new Date(data.endTime) > new Date(data.startTime);
}, {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime'],
});

interface VoucherFormValues {
    name: string;
    code?: string;
    description?: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    categoryId?: number | null;
    applyMode: 'AUTO' | 'CODE_REQUIRED';
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerUser?: number;
    startTime: string;
    endTime: string;
}

interface VoucherFormProps {
    voucher?: Voucher;
    onSubmit: (data: VoucherFormValues) => Promise<void>;
    loading?: boolean;
}

export function VoucherForm({ voucher, onSubmit, loading }: VoucherFormProps) {
    const form = useForm<VoucherFormValues>({
        resolver: zodResolver(voucherSchema) as any,
        defaultValues: voucher
            ? {
                name: voucher.name,
                code: voucher.code || '',
                description: voucher.description || '',
                type: voucher.type,
                categoryId: voucher.categoryId ?? null,
                applyMode: voucher.applyMode,
                discountValue: voucher.discountValue,
                minOrderAmount: voucher.minOrderAmount ?? undefined,
                maxDiscountAmount: voucher.maxDiscountAmount ?? undefined,
                usageLimit: voucher.usageLimit ?? undefined,
                usageLimitPerUser: voucher.usageLimitPerUser ?? undefined,
                startTime: voucher.startTime ? new Date(voucher.startTime).toISOString().slice(0, 16) : '',
                endTime: voucher.endTime ? new Date(voucher.endTime).toISOString().slice(0, 16) : '',
            }
            : {
                name: '',
                type: 'PERCENTAGE',
                categoryId: null,
                applyMode: 'AUTO',
                discountValue: 0,
                startTime: new Date().toISOString().slice(0, 16),
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            },
    });

    const watchApplyMode = form.watch('applyMode');
    const watchType = form.watch('type');

    const handleFormSubmit: SubmitHandler<VoucherFormValues> = async (data) => {
        await onSubmit(data);
    };

    const typeOptions: FormOption[] = Object.entries(VOUCHER_TYPE_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const applyModeOptions: FormOption[] = Object.entries(APPLY_MODE_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    return (
        <Form form={form} onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Tên mã giảm giá"
                            placeholder="VD: Giảm 20% đơn đầu tiên"
                            required
                        />

                        {watchApplyMode === 'CODE_REQUIRED' && (
                            <FormInput
                                control={form.control}
                                name="code"
                                label="Mã giảm giá"
                                placeholder="VD: WELCOME20"
                                description="Để trống sẽ tự động tạo mã"
                            />
                        )}

                        <FormTextarea
                            control={form.control}
                            name="description"
                            label="Mô tả"
                            placeholder="Mô tả mã giảm giá..."
                        />
                    </CardContent>
                </Card>

                {/* Discount Config */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình giảm giá</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormSelect
                            control={form.control}
                            name="type"
                            label="Loại giảm giá"
                            options={typeOptions}
                            required
                        />

                        <FormInput
                            control={form.control}
                            name="categoryId"
                            label="ID Danh mục áp dụng"
                            type="number"
                            placeholder="Áp dụng cho tất cả nếu để trống"
                        />

                        <FormSelect
                            control={form.control}
                            name="applyMode"
                            label="Chế độ áp dụng"
                            options={applyModeOptions}
                            required
                        />

                        <FormInput
                            control={form.control}
                            name="discountValue"
                            label={`Giá trị giảm ${watchType === 'PERCENTAGE' ? '(%)' : '(VND)'}`}
                            type="number"
                            required
                        />
                    </CardContent>
                </Card>

                {/* Time Config */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thời gian áp dụng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="startTime"
                            label="Bắt đầu"
                            type="datetime-local"
                            required
                        />

                        <FormInput
                            control={form.control}
                            name="endTime"
                            label="Kết thúc"
                            type="datetime-local"
                            required
                        />
                    </CardContent>
                </Card>

                {/* Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Giới hạn sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="minOrderAmount"
                            label="Đơn tối thiểu (VND)"
                            type="number"
                            placeholder="0"
                        />

                        <FormInput
                            control={form.control}
                            name="maxDiscountAmount"
                            label="Giảm tối đa (VND)"
                            type="number"
                            placeholder="Không giới hạn"
                        />

                        <FormInput
                            control={form.control}
                            name="usageLimit"
                            label="Số lần sử dụng tối đa"
                            type="number"
                            placeholder="Không giới hạn"
                        />

                        <FormInput
                            control={form.control}
                            name="usageLimitPerUser"
                            label="Số lần/người dùng"
                            type="number"
                            placeholder="Không giới hạn"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Đang lưu...' : voucher ? 'Cập nhật' : 'Tạo mã giảm giá'}
                </Button>
            </div>
        </Form>
    );
}
