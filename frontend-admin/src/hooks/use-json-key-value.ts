import { useState, useEffect, useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface KeyValue {
  key: string;
  value: string;
}

export const useJsonKeyValue = (field: ControllerRenderProps<any, string>) => {
  const [items, setItems] = useState<KeyValue[]>([]);
  const lastSyncedValue = useRef<string>("");

  // Effect 1: Sync from form field (JSON string) to local state (array of items)
  useEffect(() => {
    // Avoid an infinite loop by checking if the value is what we just set.
    if (field.value === lastSyncedValue.current) {
      return;
    }

    try {
      const parsed = field.value ? JSON.parse(field.value) : {};
      const entries = Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      // If there are no entries, start with one empty row for the user.
      setItems(entries.length > 0 ? entries : [{ key: "", value: "" }]);
    } catch (error) {
      console.error("Failed to parse JSON for key-value editor:", error);
      setItems([{ key: "", value: "" }]);
    }
  }, [field.value]);

  // Effect 2: Sync from local state (array of items) back to form field (JSON string)
  useEffect(() => {
    const obj = items.reduce<Record<string, any>>((acc, cur) => {
      if (cur.key.trim()) {
        acc[cur.key.trim()] = cur.value;
      }
      return acc;
    }, {});

    const json = JSON.stringify(obj, null, 2);

    // Only update the form field if the JSON string has actually changed.
    if (json !== field.value) {
      lastSyncedValue.current = json;
      field.onChange(json);
    }
  }, [items, field]);

  const handleAddRow = () => {
    setItems((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: "key" | "value", value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return { items, handleAddRow, handleRemoveRow, handleChange };
};