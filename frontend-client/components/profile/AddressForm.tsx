'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Address, GHNProvince, GHNDistrict, GHNWard } from '@/types/user';
import { getProvinces, getDistricts, getWards } from '@/lib/api/ghn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinces, setProvinces] = useState<GHNProvince[]>([]);
    const [districts, setDistricts] = useState<GHNDistrict[]>([]);
    const [wards, setWards] = useState<GHNWard[]>([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

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

    // Load provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                toast.error('Failed to load provinces');
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (!selectedProvinceId) {
            setDistricts([]);
            return;
        }

        const loadDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const data = await getDistricts(selectedProvinceId);
                setDistricts(data);
            } catch (error) {
                toast.error('Failed to load districts');
            } finally {
                setLoadingDistricts(false);
            }
        };
        loadDistricts();
    }, [selectedProvinceId]);

    // Load wards when district changes
    useEffect(() => {
        if (!selectedDistrictId) {
            setWards([]);
            return;
        }

        const loadWards = async () => {
            setLoadingWards(true);
            try {
                const data = await getWards(selectedDistrictId);
                setWards(data);
            } catch (error) {
                toast.error('Failed to load wards');
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [selectedDistrictId]);

    const handleSubmit = async (data: AddressFormValues) => {
        setIsSubmitting(true);
        try {
            // Ensure city and state are populated from province/district names if empty
            // This maintains backward compatibility with backend fields
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
                                    // Reset child fields
                                    form.setValue('districtId', 0); // Reset to invalid ID to clear selection
                                    form.setValue('wardCode', '');
                                    // Set name
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
                                    // Reset child field
                                    form.setValue('wardCode', '');
                                    // Set name
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
                                    // Set name
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

            <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                    id="street"
                    {...form.register('street')}
                    placeholder="e.g. 123 Nguyen Hue"
                />
                {form.formState.errors.street && (
                    <p className="text-sm text-red-500">{form.formState.errors.street.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="buildingName">Building / Apartment / House Number</Label>
                <Input
                    id="buildingName"
                    {...form.register('buildingName')}
                    placeholder="e.g. Landmark 81, Apt 1204"
                />
                {form.formState.errors.buildingName && (
                    <p className="text-sm text-red-500">{form.formState.errors.buildingName.message}</p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Controller
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <Checkbox
                            id="isDefault"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
            </div>

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
