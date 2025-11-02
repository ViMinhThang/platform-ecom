'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ProductOption } from '@/constants/mock-api';

interface ProductOptionItemProps {
  option: ProductOption;
  onSave: (updated: ProductOption) => void;
  onRemove: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Option name must be at least 2 characters.' }),
  image: z
    .string()
    .url({ message: 'Image must be a valid URL.' })
    .optional(),
  values: z
    .array(
      z.object({
        value: z.string().min(1, { message: 'Value cannot be empty.' }),
      })
    )
    .min(1, { message: 'At least one value is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductOptionItem({ option, onSave, onRemove }: ProductOptionItemProps) {
  const { control, handleSubmit, register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: option ?? {
      id: crypto.randomUUID(),
      name: '',
      image: '',
      values: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  });

  function onSubmit(data: FormValues) {
    const updated: ProductOption = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      image: data.image ?? '',
      values: data.values,
    };
    onSave(updated);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 5MB');
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert('Only .jpg, .jpeg, .png, .webp formats are accepted');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setValue('image', imageUrl);
    }
  }

  const image = watch('image');

  return (
    <Card className="space-y-4 border p-4">
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="h-12 w-12 rounded-md object-cover border"
                />
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Option Name</Label>
            <Input
              {...register('name')}
              placeholder="e.g. Size, Color"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Values</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`values.${index}.value`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter value (e.g. Red, XL)" />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
            {errors.values && (
              <p className="text-sm text-red-500">{errors.values.message as string}</p>
            )}
            <Button
              variant="secondary"
              type="button"
              onClick={() => append({ value: '' })}
            >
              + Add Value
            </Button>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="destructive" type="button" onClick={onRemove}>
              Remove Option
            </Button>
            <Button type="submit" className='bg-black'>Save Option</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
