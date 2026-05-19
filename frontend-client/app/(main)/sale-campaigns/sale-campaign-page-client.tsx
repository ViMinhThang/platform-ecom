'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { SaleCampaign } from '@/types/sale-campaign';
import { CountdownTimer } from '@/components/sale-campaign';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface SaleCampaignPageClientProps {
    initialSaleCampaigns: SaleCampaign[];
}

export function SaleCampaignPageClient({ initialSaleCampaigns }: SaleCampaignPageClientProps) {
    if (initialSaleCampaigns.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Zap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-black uppercase">Không có Sale Campaign nào</h1>
                <p className="text-muted-foreground mt-2">
                    Hiện tại chưa có chương trình Sale Campaign nào đang diễn ra. Hãy quay lại sau!
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary text-white">
                    <Zap className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-wider">Sale Campaigns</h1>
            </div>

            <div className="grid gap-6">
                {initialSaleCampaigns.map((saleCampaign) => (
                    <Link key={saleCampaign.id} href={`/sale-campaigns/${saleCampaign.slug}`}>
                        <Card className="border-2 border-black rounded-none overflow-hidden hover:bg-zinc-50 transition-colors">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Banner Image */}
                                    {saleCampaign.bannerUrl && (
                                        <div className="relative w-full md:w-80 h-48 md:h-auto bg-zinc-100">
                                            <Image
                                                src={"http://localhost:8080/upload/products" + saleCampaign.bannerUrl}
                                                alt={saleCampaign.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h2 className="text-xl font-black uppercase tracking-wider">{saleCampaign.name}</h2>
                                                <span className="px-2 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest">
                                                    Live
                                                </span>
                                            </div>
                                            {saleCampaign.description && (
                                                <p className="text-muted-foreground text-sm mb-4">{saleCampaign.description}</p>
                                            )}
                                            <div className="text-sm text-muted-foreground">
                                                {saleCampaign.totalItems} sản phẩm đang giảm giá
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
                                                Kết thúc trong
                                            </div>
                                            <CountdownTimer endTime={saleCampaign.endTime} variant="card" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
