'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Address } from '@/types/user';
import { useAddressData } from '@/hooks/useAddressData';
import { FormField } from '@/components/common/form/FormField';
import { FormCheckbox } from '@/components/common/form/FormCheckbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
    street: z.string().min(5, 'Địa chỉ đường phải có ít nhất 5 ký tự'),
    buildingName: z.string().min(2, 'Tên tòa nhà phải có ít nhất 2 ký tự'),
    provinceId: z.number().min(1, 'Tỉnh/Thành phố là bắt buộc'),
    districtId: z.number().min(1, 'Quận/Huyện là bắt buộc'),
    wardCode: z.string().min(1, 'Phường/Xã là bắt buộc'),
    isDefault: z.boolean().optional(),
    // Hidden fields to store names
    provinceName: z.string(),
    districtName: z.string(),
    wardName: z.string(),
    // Optional fields for backward compatibility
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string(),
    pincode: z.string(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
    initialData?: Address;
    onSubmit: (data: Address) => Promise<void>;
    onCancel: () => void;
}


export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: initialData?.street || '',
            buildingName: initialData?.buildingName || '',
            provinceId: initialData?.provinceId || 0,
            districtId: initialData?.districtId || 0,
            wardCode: initialData?.wardCode || '',
            isDefault: initialData?.isDefault || false,
            provinceName: initialData?.provinceName || '',
            districtName: initialData?.districtName || '',
            wardName: initialData?.wardName || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            country: initialData?.country || 'Vietnam',
            pincode: initialData?.pincode || '70000',
        },
    });

    const selectedProvinceId = form.watch('provinceId');
    const selectedDistrictId = form.watch('districtId');

    const {
        provinces,
        districts,
        wards,
        loadingProvinces,
        loadingDistricts,
        loadingWards,
    } = useAddressData(selectedProvinceId, selectedDistrictId);

    const handleSubmit = async (data: AddressFormValues) => {
        setIsSubmitting(true);
        try {
            const submissionData: Address = {
                ...data,
                addressId: initialData?.addressId,
                city: data.provinceName,
                state: data.districtName,
            };

            await onSubmit(submissionData);
        } catch (error: any) {
            // Error handled by parent or toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Province Select */}
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">TỈNH / THÀNH PHỐ</Label>
                    <Controller
                        control={form.control}
                        name="provinceId"
                        render={({ field }) => (
                            <Select
                                disabled={loadingProvinces}
                                onValueChange={(value) => {
                                    const id = parseInt(value);
                                    field.onChange(id);
                                    form.setValue('districtId', 0);
                                    form.setValue('wardCode', '');
                                    const province = provinces.find(p => p.ProvinceID === id);
                                    if (province) form.setValue('provinceName', province.ProvinceName);
                                }}
                                value={field.value?.toString()}
                            >
                                <SelectTrigger className="rounded-sm border-border h-12 text-[10px] font-bold uppercase tracking-widest focus:ring-primary/20 bg-background shadow-sm">
                                    <SelectValue placeholder="CHỌN TỈNH / THÀNH PHỐ" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border max-h-[300px] shadow-xl">
                                    {provinces.map((province) => (
                                        <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground focus:bg-primary/5 focus:text-primary">
                                            {province.ProvinceName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.provinceId && (
                        <p className="text-[10px] uppercase font-bold text-red-600 mt-1">{form.formState.errors.provinceId.message}</p>
                    )}
                </div>

                {/* District Select */}
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">QUẬN / HUYỆN</Label>
                    <Controller
                        control={form.control}
                        name="districtId"
                        render={({ field }) => (
                            <Select
                                disabled={!selectedProvinceId || loadingDistricts}
                                onValueChange={(value) => {
                                    const id = parseInt(value);
                                    field.onChange(id);
                                    form.setValue('wardCode', '');
                                    const district = districts.find(d => d.DistrictID === id);
                                    if (district) form.setValue('districtName', district.DistrictName);
                                }}
                                value={field.value ? field.value.toString() : ''}
                            >
                                <SelectTrigger className="rounded-sm border-border h-12 text-[10px] font-bold uppercase tracking-widest focus:ring-primary/20 bg-background shadow-sm">
                                    <SelectValue placeholder="CHỌN QUẬN / HUYỆN" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border max-h-[300px] shadow-xl">
                                    {districts.map((district) => (
                                        <SelectItem key={district.DistrictID} value={district.DistrictID.toString()} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground focus:bg-primary/5 focus:text-primary">
                                            {district.DistrictName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.districtId && (
                        <p className="text-[10px] uppercase font-bold text-red-600 mt-1">{form.formState.errors.districtId.message}</p>
                    )}
                </div>

                {/* Ward Select */}
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">PHƯỜNG / XÃ</Label>
                    <Controller
                        control={form.control}
                        name="wardCode"
                        render={({ field }) => (
                            <Select
                                disabled={!selectedDistrictId || loadingWards}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const ward = wards.find(w => w.WardCode === value);
                                    if (ward) form.setValue('wardName', ward.WardName);
                                }}
                                value={field.value}
                            >
                                <SelectTrigger className="rounded-sm border-border h-12 text-[10px] font-bold uppercase tracking-widest focus:ring-primary/20 bg-background shadow-sm">
                                    <SelectValue placeholder="CHỌN PHƯỜNG / XÃ" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border max-h-[300px] shadow-xl">
                                    {wards.map((ward) => (
                                        <SelectItem key={ward.WardCode} value={ward.WardCode} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground focus:bg-primary/5 focus:text-primary">
                                            {ward.WardName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.wardCode && (
                        <p className="text-[10px] uppercase font-bold text-red-600 mt-1">{form.formState.errors.wardCode.message}</p>
                    )}
                </div>
            </div>

            <FormField
                label="ĐỊA CHỈ ĐƯỜNG"
                id="street"
                registration={form.register('street')}
                error={form.formState.errors.street}
                placeholder="Ví dụ: 123 Nguyễn Huệ"
                className="text-[10px] font-bold uppercase tracking-widest"
            />

            <FormField
                label="CHI TIẾT (TÒA NHÀ / SỐ NHÀ)"
                id="buildingName"
                registration={form.register('buildingName')}
                error={form.formState.errors.buildingName}
                placeholder="Ví dụ: Landmark 81, căn hộ 1204"
                className="text-[10px] font-bold uppercase tracking-widest"
            />

            <FormCheckbox
                label="ĐẶT LÀM ĐỊA CHỈ MẶC ĐỊNH"
                id="isDefault"
                name="isDefault"
                control={form.control}
            />

            <div className="flex justify-end pt-8 border-t border-dashed border-border mt-8 gap-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting} className="rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all">
                    HỦY BỎ
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-sm shadow-lg shadow-primary/10 text-[11px] font-bold uppercase tracking-widest px-10 h-12 transition-all">
                    {isSubmitting && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
                    LƯU ĐỊA CHỈ
                </Button>
            </div>
        </form>
    );
}
