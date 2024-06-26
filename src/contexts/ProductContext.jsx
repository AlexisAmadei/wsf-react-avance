import { createContext, useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
} from "../services/productGateway";
import GatewayFactory from "../services/gatewayFactory";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [state, setState] = useState({
    products: undefined,
    isLoading: true,
  });

  

  useEffect(() => {
    setTimeout(async () => {
      productGateway.getProducts().then((data) =>
        setState({
          products: data,
          isLoading: false,
        })
      );
    }, 7000);
  }, []);

  const actions = {
    async addProduct(product) {
      const newProduct = await addProduct(product);
      setState((state) => ({
        ...state,
        products: [...state.products, newProduct],
      }));
    },
    async deleteProduct(productToDelete) {
      await deleteProduct(productToDelete);
      setState((state) => ({
        ...state,
        products: state.products.filter((p) => p.id !== productToDelete.id),
      }));
    },
  };

  const selectors = {
    getProducts: (filters = {}) =>
      state.products?.filter((p) =>
        Object.keys(filters).every((f) => p[f] === filters[f])
      ) ?? [],
    isLoading: () => state.isLoading,
  };

  return (
    <ProductContext.Provider value={{ actions, selectors }}>
      {children}
    </ProductContext.Provider>
  );
}
