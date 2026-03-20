'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

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

const chartData = [
  { week: 'T1', revenue: 186, orders: 80 },
  { week: 'T2', revenue: 305, orders: 200 },
  { week: 'T3', revenue: 237, orders: 120 },
  { week: 'T4', revenue: 290, orders: 190 },
  { week: 'T5', revenue: 320, orders: 150 },
  { week: 'T6', revenue: 280, orders: 140 },
  { week: 'T7', revenue: 350, orders: 210 }
];

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

export function TrendChart() {
  return (
    <Card className='@container/card'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-base font-semibold'>Xu hướng tuần</CardTitle>
            <CardDescription>Doanh thu và đơn hàng theo tuần</CardDescription>
          </div>
          <div className='flex items-center gap-1 text-xs text-emerald-600 font-medium'>
            <TrendingUp className='h-3 w-3' />
            +8.2%
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
              dataKey='week'
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
              width={32}
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
            <div className='h-2 w-2 rounded-full bg-primary' />
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
