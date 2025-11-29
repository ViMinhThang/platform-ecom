'use client';

import { useState, useEffect } from 'react';
import { Order, PaginatedResponse } from '@/types/user';
import { getUserOrders } from '@/lib/api/profile';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async (page: number) => {
        setLoading(true);
        try {
            const data = await getUserOrders(page, pagination.pageSize);
            setOrders(data.content);
            setPagination({
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                lastPage: data.lastPage,
            });
        } catch (error) {
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(0);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchOrders(newPage);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'cancelled':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell className="font-medium">#{order.orderId}</TableCell>
                                    <TableCell>
                                        {order.orderDate ? format(new Date(order.orderDate), 'MMM dd, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.orderStatus)}>
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Order Details #{order.orderId}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Order Date</p>
                                                            <p className="font-medium">
                                                                {order.orderDate ? format(new Date(order.orderDate), 'PPP') : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Status</p>
                                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                                {order.orderStatus}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Payment Method</p>
                                                            <p className="font-medium">
                                                                {order.payment?.paymentMethod || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Total Amount</p>
                                                            <p className="font-medium text-lg">
                                                                ${order.totalAmount.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium mb-2">Order Items</h4>
                                                        <div className="border rounded-md divide-y">
                                                            {order.orderItems.map((item) => (
                                                                <div key={item.productId + "" + order.orderId} className="p-3 flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-medium">Product ID: {item.productId}</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Qty: {item.quantity} x ${item.orderedProductPrice.toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                    <p className="font-medium">
                                                                        ${(item.quantity * item.orderedProductPrice).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.pageNumber - 1)}
                        disabled={pagination.pageNumber === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.pageNumber + 1} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.pageNumber + 1)}
                        disabled={pagination.lastPage}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
