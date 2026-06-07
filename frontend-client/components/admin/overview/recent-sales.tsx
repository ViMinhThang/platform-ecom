'use client';

import * as React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface RecentOrderData {
  id: number;
  groupNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  status: string;
  createdAt: string;
}

interface RecentSalesProps {
  data: RecentOrderData[];
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'text-emerald-600';
    case 'PROCESSING':
    case 'PAID':
      return 'text-blue-600';
    case 'CANCELLED':
      return 'text-red-600';
    case 'FULLY_REFUNDED':
    case 'PARTIALLY_REFUNDED':
      return 'text-orange-600';
    default:
      return 'text-muted-foreground';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'PAID':
      return 'Đã thanh toán';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'FULLY_REFUNDED':
      return 'Đã hoàn tiền';
    case 'PARTIALLY_REFUNDED':
      return 'Hoàn tiền một phần';
    default:
      return 'Không xác định';
  }
}

function OrderDate({ createdAt }: { createdAt: string }) {
    const [displayDate, setDisplayDate] = React.useState("");
    React.useEffect(() => {
        setDisplayDate(format(new Date(createdAt), 'dd/MM HH:mm', { locale: vi }));
    }, [createdAt]);
    return <>{displayDate}</>;
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>Đơn hàng gần đây</CardTitle>
        <CardDescription>{data.length} giao dịch gần nhất</CardDescription>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='space-y-1'>
          {data.map((order) => (
            <div 
              key={order.id} 
              className='flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/50'
            >
              <Avatar className='size-9 ring-2 ring-primary/10'>
                <AvatarFallback className='bg-primary/10 text-primary text-xs font-medium'>
                  {order.customerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{order.customerName}</p>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span className={`font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span>•</span>
                  <span>
                    <OrderDate createdAt={order.createdAt} />
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='font-semibold text-sm'>
                  ₫{Number(order.totalAmount).toLocaleString('vi-VN')}
                </div>
                <div className='text-xs text-muted-foreground'>
                  #{order.groupNumber.slice(-6)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
