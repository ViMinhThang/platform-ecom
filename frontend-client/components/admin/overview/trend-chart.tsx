'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(m => ({ default: m.LineChart })), { ssr: false }) as React.ComponentType<any>;
const Line = dynamic(() => import('recharts').then(m => ({ default: m.Line })), { ssr: false }) as React.ComponentType<any>;
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false }) as React.ComponentType<any>;
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false }) as React.ComponentType<any>;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export interface TrendChartData {
  month: number;
  monthName: string;
  revenue: number;
  orderCount: number;
}

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--primary))'
  },
  orders: {
    label: 'Đơn hàng',
    color: 'hsl(var(--muted-foreground))'
  }
} satisfies ChartConfig;

interface TrendChartProps {
  data: TrendChartData[];
}

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((item) => ({
    month: item.monthName,
    revenue: Number(item.revenue),
    orders: item.orderCount
  }));

  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const revenueGrowth = previousMonth && previousMonth.revenue > 0
    ? ((currentMonth?.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
    : '0';

  return (
    <Card className='@container/card'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-base font-semibold'>Xu hướng doanh thu</CardTitle>
            <CardDescription>Doanh thu và đơn hàng theo tháng</CardDescription>
          </div>
          <div className='flex items-center gap-1 text-xs text-emerald-600 font-medium'>
            <TrendingUp className='size-3' />
            {revenueGrowth}%
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-2 sm:px-4 sm:pt-4'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[220px] w-full'
        >
          <LineChart
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 8,
              bottom: 0
            }}
          >
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickMargin={8}
              width={60}
              tickFormatter={(value: number) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : value.toString()
              }
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey='revenue'
              type='monotone'
              stroke='var(--color-revenue)'
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--color-revenue)', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              dataKey='orders'
              type='monotone'
              stroke='var(--color-orders)'
              strokeWidth={2}
              strokeDasharray='4 4'
              dot={{ r: 3, fill: 'var(--color-orders)', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
        <div className='flex items-center justify-center gap-6 mt-4'>
          <div className='flex items-center gap-2'>
            <div className='size-2 rounded-full bg-primary' />
            <span className='text-xs text-muted-foreground'>Doanh thu</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-4 rounded-full bg-muted-foreground/50' />
            <span className='text-xs text-muted-foreground'>Đơn hàng</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
