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
            <div className="col-span-full py-20 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20 font-labels">
                    Hiện chưa cập nhật thông số kỹ thuật chi tiết.
                </p>
            </div>
        );
    }

    return (
        <div className="contents">
            {specEntries.map(([key, value]) => (
                <div
                    key={key}
                    className="flex justify-between items-baseline w-full pb-6 border-b border-foreground/5"
                >
                    <div className="text-foreground/80 text-[10px] font-black uppercase tracking-[0.4em] font-labels">
                        {TRANSLATIONS[key.toLowerCase()] || key.replace(/_/g, " ")}
                    </div>
                    <div className="text-foreground/90 font-bold text-lg tracking-tighter font-labels uppercase">
                        {String(value)}
                    </div>
                </div>
            ))}
        </div>
    );
};
