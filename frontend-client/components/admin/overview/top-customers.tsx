'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconUsers, IconShoppingBag } from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface TopCustomerData {
  userId: number;
  username: string;
  email: string;
  totalSpent: string;
  orderCount: number;
}

interface TopCustomersProps {
  data?: TopCustomerData[];
  isLoading?: boolean;
}

export function TopCustomers({ data = [], isLoading }: TopCustomersProps) {
  if (isLoading) {
    return <TopCustomersSkeleton />;
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold flex items-center gap-2'>
          <IconUsers className='size-5 text-primary' />
          Phân tích khách hàng
        </CardTitle>
        <CardDescription>Top 5 khách hàng chi tiêu nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='space-y-1'>
          {data.length === 0 ? (
            <div className='flex h-[240px] items-center justify-center text-sm text-muted-foreground'>
              Không có dữ liệu khách hàng
            </div>
          ) : (
            data.map((customer, index) => (
              <div
                key={customer.userId || index}
                className='flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/50'
              >
                <Avatar className='size-9 ring-2 ring-primary/10 shrink-0'>
                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                    {customer.username ? customer.username.slice(0, 2).toUpperCase() : 'CU'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{customer.username || 'Khách hàng'}</p>
                  <p className='text-xs text-muted-foreground truncate'>{customer.email || 'No email'}</p>
                </div>
                <div className='text-right shrink-0'>
                  <div className='font-semibold text-sm text-foreground'>
                    ₫{Number(customer.totalSpent).toLocaleString('vi-VN')}
                  </div>
                  <div className='text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end mt-0.5'>
                    <IconShoppingBag className='size-3 inline' />
                    <span>{customer.orderCount} đơn hàng</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopCustomersSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[240px] mt-1' />
      </CardHeader>
      <CardContent className='px-5'>
        <div className='space-y-4 py-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='size-9 rounded-full' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-4 w-[120px]' />
                <Skeleton className='h-3 w-[150px]' />
              </div>
              <div className='space-y-1 text-right'>
                <Skeleton className='h-4 w-[95px] ml-auto' />
                <Skeleton className='h-3 w-[60px] ml-auto' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
