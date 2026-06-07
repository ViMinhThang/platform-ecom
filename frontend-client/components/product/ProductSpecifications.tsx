'use client';

import { ProductDetail } from "@/types/product";

interface ProductSpecificationsProps {
    product: ProductDetail;
}

const TRANSLATIONS: Record<string, string> = {
    brand: "Thương hiệu",
    model: "Kiểu dáng",
    color: "Màu sắc",
    material: "Chất liệu",
    weight: "Trọng lượng",
    dimensions: "Kích thước",
    origin: "Nguồn gốc",
    warranty: "Bảo hành",
    resolution: "Độ phân giải",
    processor: "Bộ vi xử lý",
    ram: "Bộ nhớ RAM",
    storage: "Lưu trữ",
    battery: "Thời lượng pin",
    os: "Hệ điều hành",
    connection_type: "Kiểu kết nối",
    interface: "Giao tiếp",
    switch: "Phím bấm",
    keycap: "Chất liệu phím",
    sensor: "Cảm biến",
    dpi: "Độ nhạy DPI",
};

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
    const specs = product.specifications || {};
    const specEntries = Object.entries(specs);

    if (specEntries.length === 0) {
        return (
            <div className="col-span-2 py-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20">
                    Hiện chưa cập nhật thông số chi tiết.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-foreground/5 w-full">
            {specEntries.slice(0, 4).map(([key, value]) => (
                <div key={key} className="space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/40">
                        {TRANSLATIONS[key.toLowerCase()] || key.replace(/_/g, " ")}
                    </h4>
                    <p className="text-sm font-bold text-foreground">
                        {String(value)}
                    </p>
                </div>
            ))}
        </div>
    );
};
