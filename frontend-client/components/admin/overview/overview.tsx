import PageContainer from '@/components/admin/layout/page-container';
import { Button } from '@/components/ui/button';
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
import { CategoryChart } from './category-chart';
import { TrendChart } from './trend-chart';
import { RecentSales } from './recent-sales';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export default function OverViewPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
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
              <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Tổng doanh thu
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums text-foreground'>
                    ₫12.5M
                  </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1 pt-0'>
                  <Badge variant='default' className='bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 gap-1'>
                    <IconTrendingUp className='size-3' />
                    +12.5%
                  </Badge>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Tăng trưởng so với tháng trước
                  </p>
                </CardFooter>
                <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100' />
              </Card>
              <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Khách hàng mới
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums text-foreground'>
                    1,234
                  </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1 pt-0'>
                  <Badge variant='destructive' className='gap-1'>
                    <IconTrendingDown className='size-3' />
                    -20%
                  </Badge>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Cần cải thiện chiến dịch tiếp cận
                  </p>
                </CardFooter>
                <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-destructive/20 to-destructive/5 opacity-0 transition-opacity group-hover:opacity-100' />
              </Card>
              <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Tài khoản hoạt động
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums text-foreground'>
                    45,678
                  </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1 pt-0'>
                  <Badge variant='default' className='bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 gap-1'>
                    <IconTrendingUp className='size-3' />
                    +12.5%
                  </Badge>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Giữ chân người dùng tốt
                  </p>
                </CardFooter>
                <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100' />
              </Card>
              <Card className='group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Tỷ lệ tăng trưởng
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums text-foreground'>
                    4.5%
                  </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1 pt-0'>
                  <Badge variant='default' className='bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 gap-1'>
                    <IconTrendingUp className='size-3' />
                    +4.5%
                  </Badge>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Đạt theo kế hoạch đề ra
                  </p>
                </CardFooter>
                <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100' />
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-full lg:col-span-3 border-t-2 border-t-primary/20'>
                <BarGraph />
              </Card>
              <Card className='col-span-full lg:col-span-4 border-t-2 border-t-primary/20'>
                <TrendChart />
              </Card>
              <Card className='col-span-full lg:col-span-3 border-t-2 border-t-primary/20'>
                <RecentSales />
              </Card>
              <Card className='col-span-full lg:col-span-4 border-t-2 border-t-primary/20'>
                <AreaGraph />
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-full lg:col-span-3 border-t-2 border-t-primary/20'>
                <PieGraph />
              </Card>
              <Card className='col-span-full lg:col-span-4 border-t-2 border-t-primary/20'>
                <CategoryChart />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
