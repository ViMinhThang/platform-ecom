'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconPackage, IconReceipt2 } from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface TopProductData {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: string;
}

interface TopSellingProductsProps {
  data?: TopProductData[];
  isLoading?: boolean;
}

export function TopSellingProducts({ data = [], isLoading }: TopSellingProductsProps) {
  if (isLoading) {
    return <TopSellingProductsSkeleton />;
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold flex items-center gap-2'>
          <IconPackage className='size-5 text-primary' />
          Sản phẩm bán chạy nhất
        </CardTitle>
        <CardDescription>Top 5 sản phẩm mang lại doanh thu cao nhất</CardDescription>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='space-y-1'>
          {data.length === 0 ? (
            <div className='flex h-[240px] items-center justify-center text-sm text-muted-foreground'>
              Không có dữ liệu sản phẩm
            </div>
          ) : (
            data.map((product, index) => (
              <div
                key={product.productId || index}
                className='flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/50'
              >
                <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm ring-2 ring-primary/5 shrink-0'>
                  #{index + 1}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate' title={product.productName}>
                    {product.productName}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground mt-0.5'>
                    <span className='font-semibold text-foreground/80'>
                      {product.totalSold.toLocaleString('vi-VN')}
                    </span>
                    <span>sản phẩm đã bán</span>
                  </div>
                </div>
                <div className='text-right shrink-0'>
                  <div className='font-semibold text-sm text-emerald-600 dark:text-emerald-500 flex items-center gap-1 justify-end'>
                    ₫{Number(product.totalRevenue).toLocaleString('vi-VN')}
                  </div>
                  <div className='text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end'>
                    <IconReceipt2 className='size-3 inline' />
                    <span>Doanh thu</span>
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

export function TopSellingProductsSkeleton() {
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
              <Skeleton className='size-9 rounded-lg' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-4 w-[160px]' />
                <Skeleton className='h-3.5 w-[80px]' />
              </div>
              <div className='space-y-1 text-right'>
                <Skeleton className='h-4 w-[90px] ml-auto' />
                <Skeleton className='h-3 w-[50px] ml-auto' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
