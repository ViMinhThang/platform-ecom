'use client';

import * as React from 'react';
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

const chartData = [
  { category: 'Điện tử', sales: 450, fill: 'var(--color-primary)' },
  { category: 'Thời trang', sales: 380, fill: 'var(--color-primary)' },
  { category: 'Nhà cửa', sales: 290, fill: 'var(--color-primary)' },
  { category: 'Sức khỏe', sales: 220, fill: 'var(--color-primary)' },
  { category: 'Thể thao', sales: 180, fill: 'var(--color-primary)' },
  { category: 'Sách', sales: 120, fill: 'var(--color-primary)' }
];

const chartConfig = {
  sales: {
    label: 'Doanh số'
  },
  category: {
    label: 'Danh mục'
  }
} satisfies ChartConfig;

export function CategoryChart() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>Danh mục hàng đầu</CardTitle>
        <CardDescription>
          Danh mục bán chạy nhất theo doanh số
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-2 sm:px-4 sm:pt-4'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[220px] w-full'
        >
          <BarChart
            data={chartData}
            layout='vertical'
            margin={{
              left: 8,
              right: 12
            }}
          >
            <XAxis
              type='number'
              dataKey='sales'
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => `${value}`}
            />
            <YAxis
              type='category'
              dataKey='category'
              tickLine={false}
              axisLine={false}
              width={70}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey='sales'
              radius={[0, 4, 4, 0]}
              fill='var(--color-primary)'
              opacity={0.85}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
