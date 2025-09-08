"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import React from "react";

interface InventoryCardProps {
  quantity: number;
  inStock: boolean | null;
  onStockChange: (value: boolean) => void;
  onSave: () => void;
}

export const InventoryCard = ({
  quantity,
  inStock,
  onStockChange,
  onSave,
}: InventoryCardProps) => {
  return (
    <div className="bg-white shadow-md border rounded-md p-6 flex-1 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Stock Quantity</label>
        <input
          type="text"
          className="border border-slate-300 rounded-md p-3 w-full"
          value={quantity}
          readOnly
        />
      </div>

      <div className="flex flex-col mt-2">
        <label className="text-gray-700 mb-1">Stock Availability</label>
        <div className="flex gap-4 items-center">
          <div
            className={`flex items-center gap-2 ${
              inStock ? "text-black" : "text-gray-400"
            }`}
          >
            <Checkbox
              checked={!!inStock}
              onCheckedChange={() => onStockChange(true)}
            />
            <span>In Stock</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              inStock === false ? "text-black" : "text-gray-400"
            }`}
          >
            <Checkbox
              checked={inStock === false}
              onCheckedChange={() => onStockChange(false)}
            />
            <span>Out of Stock</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button
          className="bg-black text-white p-5 rounded-md w-[30%]"
          onClick={onSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
