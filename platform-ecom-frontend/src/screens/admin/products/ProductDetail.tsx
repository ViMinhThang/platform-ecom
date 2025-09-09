import {
  useDeleteProductByIdMutation,
  useGetProductByNameEquallyQuery,
  useUpdateProductByIdMutation,
} from "@/slice/productApiSlice";
import type { ProductFormValues } from "@/types/Product";
import { getProductNameFromPath } from "@/util/util";
import { useLocation, useNavigate} from "react-router-dom";
import { DragDropInput } from "../../../components/admin/products/ImageDragDrop";
import { InventoryCard } from "../../../components/admin/products/InventoryCard";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import ProductInfoCard from "@/components/admin/products/productInfo";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
const ProductDetailAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const productName = getProductNameFromPath(location.pathname);
  const { data, isLoading, error } =
    useGetProductByNameEquallyQuery(productName);
  const [updateProduct] = useUpdateProductByIdMutation();
  const [deleteProductById] = useDeleteProductByIdMutation();
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      productName: "",
      price: 0,
      discount: 0,
      specialPrice: 0,
      type: "",
      description: "",
      category: "",
      quantity: 0,
      isAvailable: "",
      inStock: true,
      assets: [null, null, null, null],
    },
  });
  const { handleSubmit, reset, watch } = methods;
  useEffect(() => {
    if (data) {
      reset({
        productName: data.productName,
        price: data.price,
        discount: data.discount,
        specialPrice: data.specialPrice,
        quantity: data.quantity,
        type: data.type,
        slug: data.slug,
        category: data.category,
        isAvailable: data.isAvailable,
        description: data.description,
        inStock: data.quantity > 0,
        assets: data.assets.concat(
          new Array(4 - data.assets.length).fill(null)
        ),
      });
    }
  }, [data, reset]);
  const assets = watch("assets");
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!data) return <div>No product found</div>;

  const handleDeleteProduct = async () => {
    try {
      await deleteProductById(data.productId).unwrap();
      toast.success("Delete sucess");
      navigate("/admin/products")
    } catch (error) {
      toast.error("Delete error");
    }
  };

  const onSubmit = async (formData: ProductFormValues) => {
    const { assets, ...payload } = formData; // bỏ assets
    try {
      await updateProduct({
        productId: data.productId,
        data: payload,
      }).unwrap();
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Product updated failed!");
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 flex flex-col gap-6 bg-slate-100 h-full w-screen"
      >
        <h1 className="text-3xl font-bold">Editing Product</h1>

        <div className="flex gap-6 w-[85%]">
          <Controller
            control={methods.control}
            name="price"
            render={({ field }) => (
              <ProductInfoCard control={methods.control} />
            )}
          />
          <Controller
            control={methods.control}
            name="quantity"
            render={({ field }) => (
              <InventoryCard
                quantity={field.value}
                onQuantityChange={field.onChange} // <-- pass onChange
              />
            )}
          />
        </div>

        {/* Images */}
        <div className="bg-white flex flex-col border w-[85%]">
          <h1 className="font-bold text-xl p-4">Images</h1>
          <div className="flex gap-4 p-4">
            {assets.map((_, i) => (
              <DragDropInput key={i} index={i} />
            ))}
          </div>
        </div>
        <div className="bg-white flex flex-col border w-[85%]">
          <label className="text-gray-700 mb-1 p-4 pb-1">Description</label>
          <div className="flex gap-4 p-4">
            <Controller
              name="description"
              control={methods.control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="border border-slate-300 rounded-md p-3 w-full"
                  rows={4}
                />
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-black text-white px-4 py-7 rounded-md w-[15%] cursor-pointer"
          >
            Save
          </Button>
          <Button
          type="button"
          onClick={handleDeleteProduct}
            variant="outline"
            className="border-red-500 px-4 py-7 rounded-md w-[15%] opacity-75 cursor-pointer"
          >
            Delete
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductDetailAdmin;
