import { createContext, useEffect, useContext, useReducer } from "react";

const ACTIONS = {
  ADD_ITEM: "add-item",
  DECREASE_ITEM: "decrease-item",
  REMOVE_ITEM: "remove-item",
  CLEAR_CART: "clear-cart",
  LOAD_CART: "load-cart",
};

// 2. Buat Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_CART:
      return action.payload.cart;
    case ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const exist = state.find((item) => item.product.id === product.id);
      if (exist) {
        return state.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { product, quantity: 1 }];
    }
    case ACTIONS.DECREASE_ITEM: {
      const { productId } = action.payload;
      const exist = state.find((item) => item.product.id === productId);
      if (exist?.quantity === 1) {
        return state.filter((item) => item.product.id !== productId);
      }
      return state.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }
    case ACTIONS.REMOVE_ITEM:
      return state.filter(
        (item) => item.product.id !== action.payload.productId
      );
    case ACTIONS.CLEAR_CART:
      return [];
    default:
      return state;
  }
}

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const localData = localStorage.getItem("tokokita_cart");
      if (localData) {
        dispatch({
          type: ACTIONS.LOAD_CART,
          payload: { cart: JSON.parse(localData) },
        });
      }
    } catch (error) {
      console.error("Gagal memuat keranjang.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tokokita_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fungsi menambah produk (quantity +1)
  const addToCart = (product) =>
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { product } });

  // Fungsi mengurangi kuantitas produk (quantity -1)
  const decreaseQuantity = (productId) =>
    dispatch({ type: ACTIONS.DECREASE_ITEM, payload: { productId } });

  // Fungsi menghapus produk dari keranjang
  const removeFromCart = (productId) =>
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { productId } });

  // Fungsi mengosongkan keranjang setelah checkout
  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  // Menghitung jumlah total item
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Menghitung total harga di keranjang
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    itemCount,
    cartTotal,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart harus digunakan di dalam CartProvider");
  return context;
};
