import { useEffect } from "react";
import { useProduct } from "../context/productContext";
import Spinner from "../ui/Spinner";
import ProductList from "./ProductList";
import ProductOrder from "./ProductOrder";

function Products() {
  const { getProducts, apiKey, products, productsOrder } = useProduct();

  useEffect(() => {
    getProducts(apiKey);
  }, [apiKey]);

  return (
    apiKey && (
      <div className="container mx-auto bg-slate-700 p-4 flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-3xl">Welcome to Shop!</h1>
        <div className="grid grid-cols-4 gap-4 items-center mt-6">
          {products ? <ProductList /> : <Spinner />}
        </div>
        {productsOrder.length > 0 ? (
          <ProductOrder />
        ) : (
          <div className="mt-6 text-2xl font-bold text-white">
            Không có sản phẩm nào
          </div>
        )}
      </div>
    )
  );
}

export default Products;
