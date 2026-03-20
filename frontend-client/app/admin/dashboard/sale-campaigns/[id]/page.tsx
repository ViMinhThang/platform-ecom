'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageContainer from '@/components/admin/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saleCampaignService } from '@/lib/services/sale-campaign-service';
import { SaleCampaign } from '@/types/sale-campaign';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Pencil,
    Play,
    XCircle,
    Calendar,
    Tag,
    Percent,
    Package,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    SCHEDULED: { label: 'Đã lên lịch', variant: 'outline' },
    ACTIVE: { label: 'Đang hoạt động', variant: 'default' },
    ENDED: { label: 'Đã kết thúc', variant: 'secondary' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
};

export default function SaleCampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = Number(params.id);

    const [campaign, setCampaign] = useState<SaleCampaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await saleCampaignService.getById(campaignId);
                setCampaign(data);
            } catch (error) {
                toast.error('Không thể tải chiến dịch');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [campaignId]);

    const handleActivate = async () => {
        try {
            setActionLoading(true);
            const updated = await saleCampaignService.activate(campaignId);
            setCampaign(updated);
            toast.success('Đã kích hoạt chiến dịch');
        } catch (error) {
            toast.error('Kích hoạt thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setActionLoading(true);
            const updated = await saleCampaignService.cancel(campaignId);
            setCampaign(updated);
            toast.success('Đã hủy chiến dịch');
        } catch (error) {
            toast.error('Hủy thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Đang tải...</div>;
    }

    if (!campaign) {
        return <div className="p-8 text-center text-destructive">Không tìm thấy chiến dịch</div>;
    }

    const status = statusConfig[campaign.status] || { label: campaign.status, variant: 'secondary' as const };
    const canEdit = campaign.status === 'DRAFT' || campaign.status === 'SCHEDULED';
    const canActivate = campaign.status === 'DRAFT';
    const canCancel = campaign.status === 'ACTIVE' || campaign.status === 'SCHEDULED';

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-6">
                <Breadcrumbs />

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Heading title={campaign.name} description={campaign.description || ''} />
                            <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {canEdit && (
                            <Button variant="outline" asChild>
                                <Link href={`/admin/dashboard/sale-campaigns/${campaignId}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </Link>
                            </Button>
                        )}
                        {canActivate && (
                            <Button onClick={handleActivate} disabled={actionLoading}>
                                <Play className="mr-2 h-4 w-4" />
                                Kích hoạt
                            </Button>
                        )}
                        {canCancel && (
                            <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Hủy
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner */}
                        {campaign.bannerUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        Banner
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={campaign.bannerUrl.startsWith('http') ? campaign.bannerUrl : `http://localhost:8080/uploads/${campaign.bannerUrl}`}
                                            alt={campaign.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Danh mục áp dụng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {campaign.categories?.map((cat) => (
                                        <Badge key={cat.categoryId} variant="outline">
                                            {cat.categoryName}
                                        </Badge>
                                    ))}
                                    {(!campaign.categories || campaign.categories.length === 0) && (
                                        <span className="text-muted-foreground">Chưa chọn danh mục</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Discount Tiers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Percent className="h-5 w-5" />
                                    Khung giá giảm
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {campaign.discountTiers?.map((tier, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span>
                                                {tier.minPrice?.toLocaleString() ?? 0}đ - {tier.maxPrice?.toLocaleString() ?? 0}đ
                                            </span>
                                            <Badge variant="default">-{tier.discountPercent}%</Badge>
                                        </div>
                                    ))}
                                    {(!campaign.discountTiers || campaign.discountTiers.length === 0) && (
                                        <span className="text-muted-foreground">Chưa có khung giá</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Stats */}
                    <div className="space-y-6">
                        {/* Schedule */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Lịch trình
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Bắt đầu</div>
                                    <div className="font-medium">
                                        {format(new Date(campaign.startTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Kết thúc</div>
                                    <div className="font-medium">
                                        {format(new Date(campaign.endTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Thống kê
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tổng sản phẩm</span>
                                    <span className="font-medium">{campaign.totalItems || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Danh mục</span>
                                    <span className="font-medium">{campaign.categories?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Khung giá</span>
                                    <span className="font-medium">{campaign.discountTiers?.length || 0}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
