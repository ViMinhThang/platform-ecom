import { Checkbox } from "@/components/ui/checkbox";

interface InventoryCardProps {
  quantity: number;
  onQuantityChange?: (value: number | null) => void;
}

export const InventoryCard = ({
  quantity,
  onQuantityChange,
}: InventoryCardProps) => {
  return (
    <div className="bg-white shadow-md border rounded-md p-6 flex-1 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Stock Quantity</label>
        <input
          className="border border-slate-300 rounded-md p-2 w-full"
          type="number"
          value={quantity === null || quantity === undefined ? "" : quantity}
          onChange={(e) => {
            const val = e.target.value;
            onQuantityChange?.(val === "" ? null : +val);
          }}
          placeholder="0"
        />
      </div>

      <div className="flex flex-col mt-2">
        <label className="text-gray-700 mb-1">Stock Availability</label>
        <div className="flex gap-4 items-center">
          <div
            className={`flex items-center gap-2 ${
              quantity > 0 ? "text-black" : "text-gray-400"
            }`}
          >
            <Checkbox checked={quantity > 0} />
            <span>In Stock</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              quantity === 0 ? "text-black" : "text-gray-400"
            }`}
          >
            <Checkbox checked={quantity === 0} />
            <span>Out of Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};
