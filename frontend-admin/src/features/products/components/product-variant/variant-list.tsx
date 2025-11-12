import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProductVariants } from "@/providers/product-variant-provider";
import { VariantCard } from "./variant.card";

export const VariantsList = () => {
  const {
    variants,
    loading,
    addVariant,} = useProductVariants();

  if (loading) return <div>Loading variants...</div>;
    console.log('VariantsList render', variants);
  return (
    <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
      {variants.map((variant, index) => (
        <Card key={variant.variantId ?? index} className="p-4 space-y-3">
          <VariantCard variant={variant} index={index} />
        </Card>
      ))}

      <Button variant="outline" className="w-full" onClick={addVariant}>
        + Add Variant
      </Button>
    </div>
  );
};
