'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product, ProductOption } from '@/constants/mock-api';
import { nanoid } from 'nanoid';
import { ProductOptionItem } from './product-tables/product-option-item';

interface ProductOptionsEditorProps {
  product: Product;
}

export default function ProductOptionsEditor({ product }: ProductOptionsEditorProps) {
  const [options, setOptions] = useState<ProductOption[]>(
    product.options ?? []
  );

  function addOption() {
    const newOption: ProductOption = {
      id: nanoid(),
      name: '',
      values: [{ value: '' }],
    };
    setOptions([...options, newOption]);
  }

  function handleSaveOption(updated: ProductOption) {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === updated.id ? updated : opt))
    );
  }

  function handleRemoveOption(id: string) {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  }
  return (
    <Card className='mt-8'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Product Options</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {options.map((option) => (
          <ProductOptionItem
            key={option.id}
            option={option}
            onSave={handleSaveOption}
            onRemove={() => handleRemoveOption(option.id)}
          />
        ))}
        <div className='flex items-center justify-between'>
          <Button variant='secondary' onClick={addOption}>
            + Add Option
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
