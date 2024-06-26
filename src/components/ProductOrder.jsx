import { useProduct } from "../context/productContext";
import ProductOrderItem from "./ProductOrderItem";

function ProductOrder() {
  const { productsOrder, orderProduct, apiKey } = useProduct();

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs mt-4">
      <div className="w-full overflow-x-auto relative">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Còn lại</th>
              <th className="px-4 py-3">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {productsOrder.map((product) => {
              return <ProductOrderItem key={product._id} {...product} />;
            })}
          </tbody>
        </table>
        <button
          onClick={() => orderProduct(apiKey)}
          className="bg-green-500 hover:bg-green-700 select-none text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-max relative right-0"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

export default ProductOrder;
