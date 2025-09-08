import type { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";

const ProductCard = ({
  image,
  productName,
  description,
  quantity,
  price,
  discount,
  specialPrice,
}: Product) => {
  const isAvailable =
    quantity !== undefined && quantity !== null && Number(quantity) > 0;
  const navigate = useNavigate();
  const handleProductView = (productName: string) => {
    const slug = productName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/products/${slug}`);
  };

  return (
    <Card
      className="rounded-none p-0 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleProductView(productName)}
    >
      <CardContent className="p-0">
        <img
          src={image}
          alt={productName}
          className="w-fullobject-cover mb-4"
        />
        <CardHeader className="p-4">
          <CardTitle>{productName}</CardTitle>
          <CardDescription>
            <p className="text-md font-bold text-slate-800 mb-2">
              ${specialPrice.toFixed(2)}
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${price.toFixed(2)}
                </span>
              )}
            </p>
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
