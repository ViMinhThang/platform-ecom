'use client';

import * as React from 'react';
import PageContainer from "@/components/admin/layout/page-container";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })), { ssr: false }) as React.ComponentType<any>;
const Pie = dynamic(() => import('recharts').then(m => ({ default: m.Pie })), { ssr: false }) as React.ComponentType<any>;
const Label = dynamic(() => import('recharts').then(m => ({ default: m.Label })), { ssr: false }) as React.ComponentType<any>;
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useSession } from 'next-auth/react';

interface SellerReviewStats {
  totalReviews: number;
  averageRating: number;
  sentimentDistribution: {
    [key: string]: number;
  };
  ratingDistribution: {
    [key: number]: number;
  };
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  sentiment: string;
  sentimentScore: number;
  createdAt: string;
}

const chartConfig = {
  positive: {
    label: 'Tích cực',
    color: '#22c55e'
  },
  neutral: {
    label: 'Trung lập',
    color: '#eab308'
  },
  negative: {
    label: 'Tiêu cực',
    color: '#ef4444'
  }
} satisfies ChartConfig;

function ReviewDate({ createdAt }: { createdAt: string }) {
    const [displayDate, setDisplayDate] = React.useState("");
    React.useEffect(() => {
        setDisplayDate(new Date(createdAt).toLocaleDateString('vi-VN'));
    }, [createdAt]);
    return <>{displayDate}</>;
}

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [fetchState, dispatchFetch] = React.useReducer(
    (prev: any, next: any) => ({ ...prev, ...next }),
    { stats: null as SellerReviewStats | null, reviews: [] as Review[], loading: true, error: null as string | null }
  );
  const [selectedSentiment, setSelectedSentiment] = React.useState<string>('');

  const sellerId = session?.user?.id;

  const fetchData = React.useCallback(async () => {
    if (!sellerId || !session?.accessToken) return;

    try {
      dispatchFetch({ loading: true });
      const token = session.accessToken;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const headers = { Authorization: `Bearer ${token}` };

      const reviewsParams = selectedSentiment 
        ? `?sentiment=${selectedSentiment}` 
        : '';

      const [statsRes, reviewsRes] = await Promise.all([
        fetch(`${baseUrl}/api/v1/reviews/seller/${sellerId}/stats`, { headers }),
        fetch(`${baseUrl}/api/v1/reviews/seller/${sellerId}${reviewsParams}`, { headers }),
      ]);

      if (!statsRes.ok || !reviewsRes.ok) {
        throw new Error('Không thể tải dữ liệu đánh giá');
      }

      const [statsData, reviewsData] = await Promise.all([
        statsRes.json(),
        reviewsRes.json(),
      ]);

      dispatchFetch({ stats: statsData.data || statsData, reviews: reviewsData.content || [] });
    } catch (err) {
      dispatchFetch({ error: err instanceof Error ? err.message : 'Đã xảy ra lỗi' });
    } finally {
      dispatchFetch({ loading: false });
    }
  }, [sellerId, session, selectedSentiment, dispatchFetch]);

  const onFilterChange = React.useCallback(() => {
    if (!sellerId) return;
    fetchData();
  }, [sellerId, fetchData]);

  React.useEffect(() => {
    onFilterChange();
  }, [onFilterChange]);

  const chartData = React.useMemo(() => fetchState.stats ? [
    { sentiment: 'positive', count: fetchState.stats.positiveCount, fill: '#22c55e' },
    { sentiment: 'neutral', count: fetchState.stats.neutralCount, fill: '#eab308' },
    { sentiment: 'negative', count: fetchState.stats.negativeCount, fill: '#ef4444' },
  ].filter(d => d.count > 0) : [], [fetchState.stats]);

  const totalSentiments = fetchState.stats ? fetchState.stats.positiveCount + fetchState.stats.neutralCount + fetchState.stats.negativeCount : 0;

  if (fetchState.loading) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full size-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Đang tải…</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (fetchState.error) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>{fetchState.error}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Đánh giá sản phẩm</h2>
          <p className="text-muted-foreground">
            Phân tích cảm xúc khách hàng từ các đánh giá sản phẩm của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fetchState.stats?.totalReviews || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fetchState.stats?.averageRating ? fetchState.stats.averageRating.toFixed(1) : '0.0'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tích cực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {fetchState.stats?.positivePercentage?.toFixed(1) || '0.0'}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiêu cực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {fetchState.stats?.negativePercentage?.toFixed(1) || '0.0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sentiment Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ cảm xúc</CardTitle>
            <CardDescription>Tỷ lệ đánh giá tích cực, trung lập và tiêu cực</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="sentiment"
                    innerRadius={60}
                    strokeWidth={2}
                    stroke="var(--background)"
                  >
                    <Label
                      content={({ viewBox }: { viewBox: { cx?: number; cy?: number } }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalSentiments}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-sm"
                              >
                                Đánh giá
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Chưa có đánh giá
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ sao</CardTitle>
            <CardDescription>Số lượng đánh giá theo số sao</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = fetchState.stats?.ratingDistribution?.[star] || 0;
                const percentage = fetchState.stats?.totalReviews
                  ? ((count / fetchState.stats.totalReviews) * 100).toFixed(1)
                  : '0.0';
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{star} ★</span>
                    <div className="flex-1 h-3 bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-sm text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đánh giá</CardTitle>
              <CardDescription>Các đánh giá sản phẩm của bạn</CardDescription>
            </div>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="POSITIVE">Tích cực</option>
              <option value="NEUTRAL">Trung lập</option>
              <option value="NEGATIVE">Tiêu cực</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {fetchState.reviews.length > 0 ? (
            <div className="space-y-4">
              {fetchState.reviews.map((review: any) => (
                <div 
                  key={review.id} 
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{review.productId}</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      review.sentiment === 'POSITIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : review.sentiment === 'NEGATIVE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.sentiment === 'POSITIVE' 
                        ? 'Tích cực' 
                        : review.sentiment === 'NEGATIVE'
                        ? 'Tiêu cực'
                        : 'Trung lập'}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <ReviewDate createdAt={review.createdAt} />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có đánh giá nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </PageContainer>
  );
}
