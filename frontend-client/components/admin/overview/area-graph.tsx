'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then(m => ({ default: m.AreaChart })), { ssr: false }) as React.ComponentType<any>;
const Area = dynamic(() => import('recharts').then(m => ({ default: m.Area })), { ssr: false }) as React.ComponentType<any>;
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false }) as React.ComponentType<any>;
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false }) as React.ComponentType<any>;
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false }) as React.ComponentType<any>;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export interface AreaChartData {
  month: number;
  monthName: string;
  totalOrders: number;
  completed: number;
  processing: number;
  cancelled: number;
  refunded: number;
}

const chartConfig = {
  completed: {
    label: 'Hoàn thành',
    color: 'hsl(var(--primary))'
  },
  processing: {
    label: 'Đang xử lý',
    color: 'hsl(var(--muted-foreground))'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'hsl(0 84.2% 60.2%)'
  }
} satisfies ChartConfig;

interface AreaGraphProps {
  data: AreaChartData[];
}

export function AreaGraph({ data }: AreaGraphProps) {
  const chartData = data.map((item) => ({
    month: item.monthName,
    completed: item.completed,
    processing: item.processing,
    cancelled: item.cancelled
  }));

  const totalCompleted = data.reduce((acc, curr) => acc + curr.completed, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.totalOrders, 0);
  const completionRate = totalOrders > 0 ? ((totalCompleted / totalOrders) * 100).toFixed(1) : '0';

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle className='text-base'>Đơn hàng theo trạng thái</CardTitle>
        <CardDescription>
          Phân bổ đơn hàng theo tháng trong năm
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillCompleted' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-completed)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-completed)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillProcessing' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-processing)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-processing)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillCancelled' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-cancelled)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-cancelled)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='completed'
              type='natural'
              fill='url(#fillCompleted)'
              stroke='var(--color-completed)'
              stackId='a'
            />
            <Area
              dataKey='processing'
              type='natural'
              fill='url(#fillProcessing)'
              stroke='var(--color-processing)'
              stackId='a'
            />
            <Area
              dataKey='cancelled'
              type='natural'
              fill='url(#fillCancelled)'
              stroke='var(--color-cancelled)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Tỷ lệ hoàn thành {completionRate}%{' '}
              <TrendingUp className='size-4 text-emerald-600' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {totalOrders.toLocaleString()} đơn hàng trong năm
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
