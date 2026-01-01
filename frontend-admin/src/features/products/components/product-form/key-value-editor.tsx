"use client";

import React from "react";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useJsonKeyValue } from "@/hooks/use-json-key-value";

interface JsonKeyValueEditorProps {
  name: string;
  label: string;
  control: Control<any>;
}

export const JsonKeyValueEditor: React.FC<JsonKeyValueEditorProps> = ({
  name,
  label,
  control,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="{}"
      render={({ field }) => {
        const { items, handleAddRow, handleRemoveRow, handleChange } =
          useJsonKeyValue(field);

        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Input
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) => handleChange(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveRow(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddRow}>
              Add Field
            </Button>
          </div>
        );
      }}
    />
  );
};
