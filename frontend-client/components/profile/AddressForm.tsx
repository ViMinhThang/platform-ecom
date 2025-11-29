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
    street: z.string().min(5, 'Street must be at least 5 characters'),
    buildingName: z.string().min(2, 'Building name must be at least 2 characters'),
    provinceId: z.number().min(1, 'Province is required'),
    districtId: z.number().min(1, 'District is required'),
    wardCode: z.string().min(1, 'Ward is required'),
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

/**
 * Form component for creating/editing addresses.
 * Refactored to use reusable components and custom hooks following clean code principles.
 */
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

    // Use custom hook for address data management
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province Select */}
                <div className="space-y-2">
                    <Label>Province/City</Label>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
                                            {province.ProvinceName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.provinceId && (
                        <p className="text-sm text-red-500">{form.formState.errors.provinceId.message}</p>
                    )}
                </div>

                {/* District Select */}
                <div className="space-y-2">
                    <Label>District</Label>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                                            {district.DistrictName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.districtId && (
                        <p className="text-sm text-red-500">{form.formState.errors.districtId.message}</p>
                    )}
                </div>

                {/* Ward Select */}
                <div className="space-y-2">
                    <Label>Ward</Label>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map((ward) => (
                                        <SelectItem key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {form.formState.errors.wardCode && (
                        <p className="text-sm text-red-500">{form.formState.errors.wardCode.message}</p>
                    )}
                </div>
            </div>

            <FormField
                label="Street Address"
                id="street"
                registration={form.register('street')}
                error={form.formState.errors.street}
                placeholder="e.g. 123 Nguyen Hue"
            />

            <FormField
                label="Building / Apartment / House Number"
                id="buildingName"
                registration={form.register('buildingName')}
                error={form.formState.errors.buildingName}
                placeholder="e.g. Landmark 81, Apt 1204"
            />

            <FormCheckbox
                label="Set as default address"
                id="isDefault"
                name="isDefault"
                control={form.control}
            />

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Address
                </Button>
            </div>
        </form>
    );
}
