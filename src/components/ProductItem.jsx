import { useEffect, useState } from "react";
import { useProduct } from "../context/productContext";

function ProductItem({ product }) {
  const { addProduct } = useProduct();

  return (
    <div className="box p-4 shadow-lg bg-white rounded-lg relative">
      <img
        src={product.image}
        alt="Trang sức Mitsubishi"
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-normal mt-2">{product.name}</h2>
      <div className="flex justify-between items-center">
        <span className="text-orange-500 font-bold">${product.price}</span>
        <button
          onClick={() => addProduct(product)}
          className="bg-green-500 hover:bg-green-700 select-none text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add to cart!
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
