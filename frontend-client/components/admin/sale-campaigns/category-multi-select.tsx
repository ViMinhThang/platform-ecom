'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { XIcon, TagIcon, ImageIcon } from 'lucide-react';
import { categoryService } from '@/lib/services/category-service';
import { Category } from '@/types/category/category';
import Image from 'next/image';

interface CategoryMultiSelectProps {
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    disabled?: boolean;
}

export function CategoryMultiSelect({ selectedIds, onChange, disabled }: CategoryMultiSelectProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories({ size: 100 });
                setCategories(response.content);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const toggleCategory = (categoryId: number) => {
        if (disabled) return;

        if (selectedIds.includes(categoryId)) {
            onChange(selectedIds.filter(id => id !== categoryId));
        } else {
            onChange([...selectedIds, categoryId]);
        }
    };

    const removeCategory = (categoryId: number) => {
        if (disabled) return;
        onChange(selectedIds.filter(id => id !== categoryId));
    };

    const selectedCategories = categories.filter(c => selectedIds.includes(c.id));

    if (loading) {
        return (
            <div className="space-y-3">
                <Label className="text-base font-semibold">Danh mục áp dụng</Label>
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={`skeleton-${i}`} className="h-12 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-base font-semibold">Danh mục áp dụng</Label>
                <p className="text-sm text-muted-foreground">
                    Chọn các danh mục sản phẩm sẽ được áp dụng khuyến mãi
                </p>
            </div>

            {/* Selected categories as badges */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(category => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="pl-2 pr-1 py-1 gap-1"
                        >
                            <TagIcon className="size-3" />
                            {category.name}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-4 ml-1 hover:bg-destructive/20"
                                onClick={() => removeCategory(category.id)}
                                disabled={disabled}
                            >
                                <XIcon className="size-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Category grid */}
            <Card>
                <ScrollArea className="h-[240px]">
                    <CardContent className="p-3">
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(category => {
                                const isSelected = selectedIds.includes(category.id);
                                return (
                                    <label
                                        key={category.id}
                                        className={`
                                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                            ${isSelected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-border hover:border-primary/50 hover:bg-accent'
                                            }
                                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleCategory(category.id)}
                                            disabled={disabled}
                                        />
                                        {category.imageUrl ? (
                                            <Image
                                                src={"http://localhost:8080/uploads/" + category.imageUrl}
                                                alt={category.name}
                                                width={32}
                                                height={32}
                                                className="size-8 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="size-8 rounded bg-muted flex items-center justify-center">
                                                <ImageIcon className="size-4 text-muted-foreground" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium truncate flex-1">
                                            {category.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </CardContent>
                </ScrollArea>
            </Card>

            <p className="text-xs text-muted-foreground">
                Đã chọn <span className="font-semibold text-primary">{selectedIds.length}</span> danh mục
            </p>
        </div>
    );
}
