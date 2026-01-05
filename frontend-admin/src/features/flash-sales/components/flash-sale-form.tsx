'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashSale, CreateFlashSaleRequest, UpdateFlashSaleRequest } from '@/types/flash-sale';

const flashSaleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    bannerUrl: z.string().url().optional().or(z.literal('')),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

interface FlashSaleFormData {
    name: string;
    description?: string;
    bannerUrl?: string;
    startTime: string;
    endTime: string;
}

interface FlashSaleFormProps {
    flashSale?: FlashSale;
    onSubmit: (data: FlashSaleFormData) => Promise<void>;
    loading?: boolean;
}

export function FlashSaleForm({ flashSale, onSubmit, loading }: FlashSaleFormProps) {
    const isEditing = !!flashSale;

    const form = useForm<FlashSaleFormValues>({
        resolver: zodResolver(flashSaleSchema),
        defaultValues: {
            name: flashSale?.name || '',
            description: flashSale?.description || '',
            bannerUrl: flashSale?.bannerUrl || '',
            startTime: flashSale?.startTime
                ? new Date(flashSale.startTime).toISOString().slice(0, 16)
                : '',
            endTime: flashSale?.endTime
                ? new Date(flashSale.endTime).toISOString().slice(0, 16)
                : '',
        },
    });

    const handleSubmit = async (data: FlashSaleFormValues) => {
        const requestData = {
            name: data.name,
            description: data.description || undefined,
            bannerUrl: data.bannerUrl || undefined,
            startTime: new Date(data.startTime).toISOString(),
            endTime: new Date(data.endTime).toISOString(),
        };
        await onSubmit(requestData);
    };

    return (
        <Card className="border-2 border-black rounded-none">
            <CardHeader className="border-b-2 border-black bg-zinc-100">
                <CardTitle className="text-lg font-black uppercase tracking-wider">
                    {isEditing ? 'EDIT FLASH SALE' : 'NEW FLASH SALE'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider">
                            Campaign Name *
                        </Label>
                        <Input
                            {...form.register('name')}
                            id="name"
                            placeholder="Summer Flash Sale"
                            className="border-2 border-black rounded-none"
                        />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-wider">
                            Description
                        </Label>
                        <Textarea
                            {...form.register('description')}
                            id="description"
                            placeholder="Describe your flash sale..."
                            className="border-2 border-black rounded-none min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bannerUrl" className="text-xs font-black uppercase tracking-wider">
                            Banner URL
                        </Label>
                        <Input
                            {...form.register('bannerUrl')}
                            id="bannerUrl"
                            placeholder="https://example.com/banner.jpg"
                            className="border-2 border-black rounded-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime" className="text-xs font-black uppercase tracking-wider">
                                Start Time *
                            </Label>
                            <Input
                                {...form.register('startTime')}
                                id="startTime"
                                type="datetime-local"
                                className="border-2 border-black rounded-none"
                            />
                            {form.formState.errors.startTime && (
                                <p className="text-xs text-destructive">{form.formState.errors.startTime.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime" className="text-xs font-black uppercase tracking-wider">
                                End Time *
                            </Label>
                            <Input
                                {...form.register('endTime')}
                                id="endTime"
                                type="datetime-local"
                                className="border-2 border-black rounded-none"
                            />
                            {form.formState.errors.endTime && (
                                <p className="text-xs text-destructive">{form.formState.errors.endTime.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white rounded-none font-black uppercase tracking-wider"
                        >
                            {loading ? 'Saving...' : isEditing ? 'Update Flash Sale' : 'Create Flash Sale'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
