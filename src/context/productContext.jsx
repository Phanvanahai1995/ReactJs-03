import { createContext, useContext, useState } from "react";
import { API_SERVER } from "../lib/config";
import toast from "react-hot-toast";
import { useLocalStorageState } from "../hook/useLocalSorageState";

const ProductContext = createContext();

function ProductProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const [products, setProducts] = useState(null);
  const [productsOrder, setProductOrder] = useLocalStorageState([], "product");

  async function getApiKey(email) {
    const res = await fetch(`${API_SERVER}/api-key?email=${email}`);

    if (!res.ok) {
      toast.error(`Email không tồn tại trong dữ liệu`);
      localStorage?.removeItem("apiKey");
      setApiKey(null);
      throw new Error("Email không tồn tại trong dữ liệu");
    } else {
      // toast.success(`Chào mừng ${email}!`);
      const data = await res.json();

      localStorage.setItem("apiKey", data.data.apiKey);
      setApiKey(localStorage.getItem("apiKey"));

      return data.data.apiKey;
    }
  }

  async function getUser(apiKey) {
    try {
      if (typeof apiKey === "string") {
        const res = await fetch(`${API_SERVER}/users/profile`, {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
        });

        if (!res.ok) {
          localStorage?.removeItem("apiKey");
          setApiKey(null);
          throw new Error("Có lỗi xảy ra vui lòng thử lại!");
        } else {
          const data = await res.json();
          toast.success(`Chào mừng ${data.data.emailId.name}`);

          return data;
        }
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra vui lòng thử lại!");
    }
  }

  async function getProducts(apiKey) {
    try {
      if (isIso88591(apiKey)) {
        const res = await fetch(`${API_SERVER}/products?limit=8`, {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
        });

        if (!res.ok) {
          localStorage?.removeItem("apiKey");
          setApiKey(null);
          throw new Error("Fail to fetch!");
        } else {
          const data = await res.json();

          setProducts(data.data.listProduct);

          return data;
        }
      } else {
        localStorage?.removeItem("apiKey");
        setApiKey(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function addProduct(product) {
    const updatedProduct = [...productsOrder];
    const indexChoose = updatedProduct.findIndex(
      (pro) => pro._id === product._id
    );

    if (apiKey !== localStorage.getItem("apiKey")) {
      setApiKey(localStorage.getItem("apiKey"));
      return;
    }

    if (indexChoose === -1) {
      const productSelected = {
        _id: product._id,
        left: product.quantity - 1,
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      updatedProduct.push(productSelected);
    } else {
      updatedProduct[indexChoose].quantity =
        updatedProduct[indexChoose].quantity + 1;

      updatedProduct[indexChoose].left = updatedProduct[indexChoose].left - 1;
    }

    setProductOrder(updatedProduct);
    toast.success("Đã thêm sản phẩm vào giỏ");
  }

  async function orderProduct(apiKey) {
    try {
      const body = productsOrder.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      }));

      const res = await fetch(`${API_SERVER}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        localStorage?.removeItem("apiKey");
        setApiKey(null);
        throw new Error("Order thất bại");
      } else {
        const data = await res.json();

        toast.success("Thanh toán thành công");
        setProductOrder([]);

        return data;
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  }

  return (
    <ProductContext.Provider
      value={{
        getApiKey,
        apiKey,
        setApiKey,
        getProducts,
        products,
        addProduct,
        productsOrder,
        orderProduct,
        getUser,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context)
    throw new Error("ProductContext was used outside of the ProviderContext");

  return context;
}

function isIso88591(str) {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // Kiểm tra nếu mã Unicode của ký tự không nằm trong khoảng 0-255
    if (charCode > 255) {
      return false;
    }
  }
  return true;
}
