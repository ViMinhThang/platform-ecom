'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateSubOrderStatusMutation } from '@/lib/store/admin';
import { getOrderStatusLabel } from '@/lib/utils/order-labels';
import { toast } from 'sonner';

const formSchema = z.object({
    status: z.string().min(1, 'Vui lòng chọn trạng thái'),
    notes: z.string().optional(),
});

interface UpdateStatusDialogProps {
    groupId: number;
    subOrderId: number;
    currentStatus: string;
    trigger?: React.ReactNode;
}

export const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
    groupId,
    subOrderId,
    currentStatus,
    trigger,
}) => {
    const [open, setOpen] = useState(false);
    const [updateSubOrderStatus, { isLoading: isUpdating }] = useUpdateSubOrderStatusMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: currentStatus,
            notes: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateSubOrderStatus({
                groupId,
                subOrderId,
                status: values.status,
                notes: values.notes,
            }).unwrap();

            toast.success('Cập nhật trạng thái thành công');
            setOpen(false);
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const statuses = [
        'PENDING',
        'PROCESSING',
        'READY_TO_PICK',
        'PICKING',
        'PICKED',
        'SHIPPED',
        'STORING',
        'TRANSPORTING',
        'SORTING',
        'DELIVERING',
        'DELIVERED',
        'DELIVERY_FAIL',
        'WAITING_TO_RETURN',
        'RETURNING',
        'RETURNED',
        'CANCELLED',
        'REFUND_PENDING',
        'REFUNDED',
        'EXCEPTION',
        'LOST',
        'DAMAGE',
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Cập nhật trạng thái</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                </DialogHeader>
                <Form form={form} onSubmit={onSubmit} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {getOrderStatusLabel(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Thêm ghi chú về thay đổi trạng thái..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>Cập nhật</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
