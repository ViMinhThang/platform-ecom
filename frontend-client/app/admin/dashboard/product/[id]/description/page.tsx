'use client';

import { useEffect, useState, useReducer } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { RichTextPreview } from '@/components/admin/rich-text-preview';
import { productService } from '@/lib/services/product-service';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Product } from '@/types/product/product';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProductDescriptionPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);

    const [fetchState, dispatchFetch] = useReducer(
        (prev: { product: Product | null; loading: boolean }, next: Partial<{ product: Product | null; loading: boolean }>) => ({ ...prev, ...next }),
        { product: null as Product | null, loading: true }
    );
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                dispatchFetch({ loading: true });
                const data = await productService.getProductById(productId);
                dispatchFetch({ product: data });
                setDescription(data.description || '');
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Không thể tải dữ liệu sản phẩm');
            } finally {
                dispatchFetch({ loading: false });
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await productService.updateProduct(productId, {
                description: description
            });
            toast.success('Cập nhật mô tả sản phẩm thành công');
        } catch (error) {
            console.error('Failed to update product:', error);
            toast.error('Không thể lưu mô tả');
        } finally {
            setSaving(false);
        }
    };

    if (fetchState.loading) {
        return <div className="flex h-full items-center justify-center">Đang tải…</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <IconChevronLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Chỉnh sửa mô tả</h1>
                        <p className="text-muted-foreground">
                            {fetchState.product?.name || 'Sản phẩm'}
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <IconDeviceFloppy size={18} />
                    {saving ? 'Đang lưu…' : 'Lưu mô tả'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                <Card className="flex flex-col overflow-hidden">
                    <div className="p-2 bg-muted/30 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                        Trình soạn thảo
                        <span className="text-[10px] normal-case bg-background px-1 rounded border">Đã bật đồng bộ thời gian thực</span>
                    </div>
                    <ScrollArea className="flex-1">
                        {!fetchState.loading && (
                            <RichTextEditor
                                key={productId}
                                value={description || ''}
                                onChange={setDescription}
                                productId={productId}
                                className="border-none rounded-none h-full"
                            />
                        )}
                    </ScrollArea>
                </Card>

                <Card className="flex flex-col overflow-hidden">
                    <div className="p-2 bg-muted/30 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Xem trước
                    </div>
                    <ScrollArea className="flex-1">
                        <RichTextPreview
                            content={description}
                            className="p-6"
                        />
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}
