'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/api-client';

export default function SellerAnalyticsPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.user?.id) return;
            try {
                const response = await apiClient.get(`/v1/analytics/sellers/${session.user.id}/overview`);
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session]);

    if (loading) return <div className="p-8">Đang tải dữ liệu phân tích...</div>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-black uppercase tracking-tight">Phân tích người bán</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Tổng lượt xem" 
                    value={stats?.totalViews || 0} 
                    icon={<Eye className="w-4 h-4" />} 
                    trend="+12%" 
                />
                <StatCard 
                    title="Tổng đơn hàng" 
                    value={stats?.totalOrders || 0} 
                    icon={<ShoppingCart className="w-4 h-4" />} 
                    trend="+5%" 
                />
                <StatCard 
                    title="Tỷ lệ chuyển đổi" 
                    value={`${((stats?.overallConversionRate || 0) * 100).toFixed(2)}%`} 
                    icon={<TrendingUp className="w-4 h-4" />} 
                    trend="+2%" 
                />
                <StatCard 
                    title="Doanh thu" 
                    value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)} 
                    icon={<DollarSign className="w-4 h-4" />} 
                    trend="+18%" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Sản phẩm xem nhiều nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.topByViews?.map((p: any, i: number) => (
                                <div key={i} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                    <span className="text-xs font-bold truncate max-w-[200px]">{p.productName}</span>
                                    <span className="text-xs font-mono">{p.views} lượt xem</span>
                                </div>
                            ))}
                            {!stats?.topByViews?.length && <p className="text-xs text-zinc-400">Chưa có dữ liệu</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Nguồn truy cập</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <SourceItem label="Tìm kiếm" percentage={45} />
                            <SourceItem label="Trực tiếp" percentage={25} />
                            <SourceItem label="Gợi ý" percentage={20} />
                            <SourceItem label="Khác" percentage={10} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: any) {
    return (
        <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{title}</CardTitle>
                <div className="p-2 bg-zinc-100 rounded-none border border-black/5">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black font-mono">{value}</div>
                <p className="text-[10px] font-bold text-green-600 mt-1 uppercase tracking-tighter">
                    {trend} so với tháng trước
                </p>
            </CardContent>
        </Card>
    );
}

function SourceItem({ label, percentage }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-2 bg-zinc-100 border border-black/5 overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
