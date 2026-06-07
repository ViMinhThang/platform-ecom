'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false }) as React.ComponentType<any>;
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false }) as React.ComponentType<any>;
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

export interface BarChartData {
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
  orderCount: {
    label: 'Đơn hàng',
    color: 'hsl(var(--muted-foreground))'
  }
} satisfies ChartConfig;

interface BarGraphProps {
  data: BarChartData[];
}

export function BarGraph({ data }: BarGraphProps) {
  const chartData = data.map((item) => ({
    month: item.monthName,
    revenue: Number(item.revenue),
    orders: item.orderCount
  }));

  const totalRevenue = data.reduce((acc, curr) => acc + Number(curr.revenue), 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orderCount, 0);

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch gap-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Doanh thu theo tháng</CardTitle>
          <CardDescription>
            Doanh thu và số đơn hàng trong năm
          </CardDescription>
        </div>
        <div className='flex'>
          <button
            className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
          >
            <span className='text-muted-foreground text-xs'>
              Tổng doanh thu
            </span>
            <span className='text-lg leading-none font-bold sm:text-2xl'>
              ₫{totalRevenue.toLocaleString('vi-VN')}
            </span>
          </button>
          <button
            className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
          >
            <span className='text-muted-foreground text-xs'>
              Tổng đơn hàng
            </span>
            <span className='text-lg leading-none font-bold sm:text-2xl'>
              {totalOrders.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
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
              width={60}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : value.toString()
              }
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[180px]'
                  labelKey='month'
                />
              }
            />
            <Bar
              dataKey='revenue'
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
