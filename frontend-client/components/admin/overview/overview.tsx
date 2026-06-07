'use client';

import * as React from 'react';
import PageContainer from '@/components/admin/layout/page-container';
import { Button } from '@/components/ui/button';

const VND_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { TrendChart } from './trend-chart';
import { RecentSales } from './recent-sales';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import {
  useGetDashboardOverviewQuery,
  useGetRevenueByMonthQuery,
  useGetOrdersByMonthQuery,
  useGetRecentOrdersQuery
} from '@/lib/store/admin';
import { Skeleton } from '@/components/ui/skeleton';

export default function OverViewPage() {
  const currentYear = new Date().getFullYear();
  
  const { data: overview, isLoading: overviewLoading } = useGetDashboardOverviewQuery(currentYear);
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueByMonthQuery(currentYear);
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersByMonthQuery(currentYear);
  const { data: recentOrders, isLoading: recentOrdersLoading } = useGetRecentOrdersQuery(10);

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return VND_FORMATTER.format(num);
  };

  const barChartData = revenueData?.map(item => ({
    month: item.month,
    monthName: item.monthName,
    revenue: parseFloat(item.revenue),
    orderCount: item.orderCount
  })) || [];

  const trendChartData = revenueData?.map(item => ({
    month: item.month,
    monthName: item.monthName,
    revenue: parseFloat(item.revenue),
    orderCount: item.orderCount
  })) || [];

  const areaChartData = ordersData?.map(item => ({
    month: item.month,
    monthName: item.monthName,
    totalOrders: item.totalOrders,
    completed: item.completed,
    processing: item.processing,
    cancelled: item.cancelled,
    refunded: item.refunded
  })) || [];

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
              Chào mừng trở lại 👋
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              Đây là tổng quan về hoạt động kinh doanh của bạn
            </p>
          </div>
          <div className='hidden items-center gap-2 sm:flex'>
            <Button variant='outline' size='sm'>Xuất báo cáo</Button>
            <Button size='sm'>Tải về</Button>
          </div>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Phân tích
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <StatCard
                title='Tổng doanh thu'
                value={overview ? formatCurrency(overview.totalRevenue) : '-'}
                growth={overview?.revenueGrowth}
                growthLabel='so với năm trước'
                isLoading={overviewLoading}
              />
              <StatCard
                title='Khách hàng mới'
                value={overview ? overview.newCustomers.toLocaleString() : '-'}
                growth={overview?.customerGrowth}
                growthLabel='so với năm trước'
                isLoading={overviewLoading}
                variant={overview?.customerGrowth && overview.customerGrowth < 0 ? 'destructive' : 'default'}
              />
              <StatCard
                title='Tổng đơn hàng'
                value={overview ? overview.totalOrders.toLocaleString() : '-'}
                growth={overview?.orderGrowth}
                growthLabel='so với năm trước'
                isLoading={overviewLoading}
              />
              <StatCard
                title='Đơn hàng hoàn thành'
                value={overview ? overview.completedOrders.toLocaleString() : '-'}
                subtitle={`Đang xử lý: ${overview?.processingOrders?.toLocaleString() || 0}`}
                isLoading={overviewLoading}
              />
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <div className='col-span-full lg:col-span-3'>
                <BarGraph data={barChartData} />
              </div>
              <div className='col-span-full lg:col-span-4'>
                <TrendChart data={trendChartData} />
              </div>
              <div className='col-span-full lg:col-span-3'>
                <RecentSales data={recentOrders || []} />
              </div>
              <div className='col-span-full lg:col-span-4'>
                <AreaGraph data={areaChartData} />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='col-span-1'>
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  growth?: number;
  growthLabel?: string;
  subtitle?: string;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
}

function StatCard({ title, value, growth, growthLabel, subtitle, isLoading, variant = 'default' }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
        <CardHeader className='pb-2'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-8 w-32 mt-2' />
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 pt-0'>
          <Skeleton className='h-5 w-16' />
        </CardFooter>
        <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100' />
      </Card>
    );
  }

  return (
    <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
      <CardHeader className='pb-2'>
        <CardDescription className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          {title}
        </CardDescription>
        <CardTitle className='text-3xl font-bold tabular-nums text-foreground'>
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 pt-0'>
        {growth !== undefined ? (
          <Badge 
            variant={variant} 
            className={`gap-1 ${variant === 'default' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}`}
          >
            {variant === 'default' ? <IconTrendingUp className='size-3' /> : <IconTrendingDown className='size-3' />}
            {growth > 0 ? '+' : ''}{growth}%
          </Badge>
        ) : subtitle ? (
          <span className='text-xs text-muted-foreground'>{subtitle}</span>
        ) : null}
        {growthLabel && (
          <p className='text-xs text-muted-foreground mt-1'>
            {growthLabel}
          </p>
        )}
      </CardFooter>
      <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100' />
    </Card>
  );
}
