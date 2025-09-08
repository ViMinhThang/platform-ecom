import { useState } from "react";

interface ProductCardProps {
  image: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  specialPrice: number;
}

const ProductCard = ({
  image,
  productName,
  description,
  quantity,
  price,
  discount,
  specialPrice,
}: ProductCardProps) => {
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const btnLoader = false;

  const [selectedViewImage, setSelectedViewImage] = useState(image);

  const isAvailable = quantity && Number(quantity) > 0;

  return (
    <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
      <div onClick={() => {}} className="w-full overflow-hidden aspect-[3/2]">
        <img
          className="cursor-pointer w-full h-full transition-transform duration-300 transform hover:scale-105"
          src={image}
          alt={productName}
        ></img>
      </div>
      <div className="p-4">
        <h2
          onClick={() => {}}
          className="text-lg font-semibold mb-2 cursor-pointer"
        >
          {productName}
        </h2>
      </div>
    </div>
  );
};

export default ProductCard;
