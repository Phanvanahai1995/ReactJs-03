import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import ProductProvider from "./context/productContext";
import Products from "./components/Products";

function App() {
  return (
    <ProductProvider>
      <Login>
        <Products />
      </Login>
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 2000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </ProductProvider>
  );
}

export default App;
