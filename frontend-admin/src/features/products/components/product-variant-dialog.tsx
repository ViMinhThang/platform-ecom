// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { PlusCircle, Trash2, List, Tag, Save } from "lucide-react";
// import type {
//   ProductVariant,
//   ProductOption,
//   ProductOptionValue,
// } from "@/types/product";

// interface ProductVariantsDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   productId: number;
//   variants: ProductVariant[];
//   options: ProductOption[];
// }

// export const ProductVariantsDialog: React.FC<ProductVariantsDialogProps> = ({
//   open,
//   onOpenChange,
//   productId,
//   variants: initialVariants,
//   options,
// }) => {
//   const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
//   const [loading, setLoading] = useState(false);

//   const handleAddVariant = () => {
//     const newVariant: ProductVariant = {
//       id: Date.now(),
//       productId,
//       sku: "",
//       price: 0,
//       comparePrice: null,
//       stock: 0,
//       isActive: true,
//       optionValues: [],
//       attributes: {},
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     setVariants([...variants, newVariant]);
//   };

//   const handleRemoveVariant = (id: number) => {
//     setVariants(variants.filter((v) => v.id !== id));
//   };

//   const handleChangeVariant = (
//     id: number,
//     field: keyof ProductVariant,
//     value: any
//   ) => {
//     setVariants((prev) =>
//       prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
//     );
//   };

//   const handleChangeOptionValue = (
//     variantId: number,
//     optionId: number,
//     valueId: number
//   ) => {
//     setVariants((prev) =>
//       prev.map((v) =>
//         v.id === variantId
//           ? {
//               ...v,
//               optionValues: v.optionValues.map((ov) =>
//                 ov.id === optionId ? { ...ov, value: valueId.toString() } : ov
//               ),
//             }
//           : v
//       )
//     );
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       // TODO: call backend API
//       console.log("Saving variants for product", productId, variants);
//       onOpenChange(false);
//     } catch (err) {
//       console.error("Failed to save variants", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <List className="h-5 w-5 text-primary" />
//             Manage Variants
//           </DialogTitle>
//           <DialogDescription>
//             Add or modify product variants (SKU, Price, Stock, Options)
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 mt-4">
//           {variants.map((variant) => (
//             <div
//               key={variant.id}
//               className="border rounded-lg p-4 space-y-4 shadow-sm"
//             >
//               {/* Variant basic info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <Label>SKU</Label>
//                   <Input
//                     placeholder="SKU"
//                     value={variant.sku}
//                     onChange={(e) =>
//                       handleChangeVariant(variant.id, "sku", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <Label>Price</Label>
//                   <Input
//                     placeholder="Price"
//                     type="number"
//                     min={0}
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleChangeVariant(
//                         variant.id,
//                         "price",
//                         parseFloat(e.target.value)
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <Label>Compare Price</Label>
//                   <Input
//                     placeholder="Compare Price"
//                     type="number"
//                     min={0}
//                     value={variant.comparePrice ?? ""}
//                     onChange={(e) =>
//                       handleChangeVariant(
//                         variant.id,
//                         "comparePrice",
//                         e.target.value ? parseFloat(e.target.value) : null
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <Label>Stock</Label>
//                   <Input
//                     placeholder="Stock"
//                     type="number"
//                     min={0}
//                     value={variant.stock}
//                     onChange={(e) =>
//                       handleChangeVariant(
//                         variant.id,
//                         "stock",
//                         parseInt(e.target.value)
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <Label>Active</Label>
//                   <Switch
//                     checked={variant.isActive}
//                     onCheckedChange={(checked) =>
//                       handleChangeVariant(variant.id, "isActive", checked)
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <Label>Remove</Label>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleRemoveVariant(variant.id)}
//                   >
//                     <Trash2 className="h-4 w-4 text-destructive" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Option values */}
//               <div className="grid grid-cols-2 gap-4">
//                 {options.map((opt) => (
//                   <div key={opt.id} className="flex flex-col">
//                     <Label className="flex items-center gap-1">
//                       <Tag className="h-4 w-4 text-muted-foreground" />
//                       {opt.displayName || opt.name}
//                     </Label>
//                     <Select
//                       value={
//                         variant.optionValues.find((ov) => ov.id === opt.id)
//                           ?.value ?? ""
//                       }
//                       onValueChange={(val) =>
//                         handleChangeOptionValue(variant.id, opt.id, Number(val))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Value" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {opt.values.map((v) => (
//                           <SelectItem key={v.id} value={v.id.toString()}>
//                             {v.displayValue || v.value}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <Button
//             size="sm"
//             variant="outline"
//             className="flex items-center gap-2"
//             onClick={handleAddVariant}
//           >
//             <PlusCircle className="h-4 w-4" /> Add Variant
//           </Button>
//         </div>

//         <DialogFooter className="flex justify-end gap-2 pt-4">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             disabled={loading}
//             className="flex items-center gap-2"
//           >
//             <Save className="h-4 w-4" />
//             {loading ? "Saving..." : "Save Variants"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
