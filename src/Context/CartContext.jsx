import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
const AuthContext = createContext();

export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  /* ================= SESSION ================= */
  const isSessionActive = () => {
    return !!localStorage.getItem("currentUser");
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  /* ================= MULTI TAB LOGOUT ================= */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "currentUser" && e.newValue === null) {
        setCurrentUser(null);
        setCartItems([]);
        setWishlistItems([]);
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (currentUser) {
      fetchUserCartItems();
      fetchUserWishlistItems();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [currentUser]);

  /* ================= LOGIN / LOGOUT ================= */
  const login = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setCartItems([]);
    setWishlistItems([]);
  };

  /* ================= USER VALIDATION ================= */
  const validateUser = async () => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return false;

    const user = JSON.parse(stored);
    const res = await axios.get(`http://localhost:3130/users/${user.id}`);

    if (!res.data || res.data.status === "blocked") {
      logout();
      return false;
    }
    return true;
  };

  /* ================= CART ================= */
  const fetchUserCartItems = async () => {
    if (!currentUser) return;
    const { data } = await axios.get("http://localhost:3130/cart");
    setCartItems(data.filter((i) => i.userId === currentUser.id));
  };

  const addToCart = async (product) => {
    if (!(await validateUser())) throw new Error("Session expired");

    const existing = cartItems.find((i) => i.productId === product.id);
    if (existing) {
      await axios.patch(`http://localhost:3130/cart/${existing.id}`, {
        quantity: existing.quantity + 1,
      });
    } else {
      await axios.post("http://localhost:3130/cart", {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: 1,
        userId: currentUser.id,
      });
    }
    fetchUserCartItems();
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item) {
      await axios.delete(`http://localhost:3130/cart/${item.id}`);
      fetchUserCartItems();
    }
  };

  const updateQuantity = async (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    const item = cartItems.find((i) => i.productId === productId);
    if (item) {
      await axios.patch(`http://localhost:3130/cart/${item.id}`, {
        quantity: qty,
      });
      fetchUserCartItems();
    }
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item) updateQuantity(productId, item.quantity - 1);
  };

  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () =>
    cartItems.reduce((t, i) => t + i.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const clearCart = async () => {
    if (!currentUser) return;
    const { data } = await axios.get("http://localhost:3130/cart");
    const items = data.filter((i) => i.userId === currentUser.id);
    await Promise.all(
      items.map((i) =>
        axios.delete(`http://localhost:3130/cart/${i.id}`)
      )
    );
    setCartItems([]);
  };

  /* ================= WISHLIST ================= */
  const fetchUserWishlistItems = async () => {
    if (!currentUser) return;
    const { data } = await axios.get("http://localhost:3130/wishlist");
    setWishlistItems(data.filter((i) => i.userId === currentUser.id));
  };

  const addToWishlist = async (product) => {
    if (!(await validateUser())) throw new Error("Session expired");

    const exists = wishlistItems.find((i) => i.productId === product.id);
    if (!exists) {
      await axios.post("http://localhost:3130/wishlist", {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        userId: currentUser.id,
      });
      fetchUserWishlistItems();
    }
  };

  const removeFromWishlist = async (productId) => {
    const item = wishlistItems.find((i) => i.productId === productId);
    if (item) {
      await axios.delete(`http://localhost:3130/wishlist/${item.id}`);
      fetchUserWishlistItems();
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((i) => i.productId === productId);

  const getWishlistCount = () => wishlistItems.length;

  /* ================= ORDERS ================= */
  const createOrder = async (orderData) => {
    if (!(await validateUser())) {
      throw new Error("User blocked or logged out");
    }
    const { data } = await axios.post("http://localhost:3130/orders", {
      ...orderData,
      orderDate: new Date().toISOString(),
      status: "confirmed",
    });
    return data;
  };

  /* ================= PROVIDERS ================= */
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isSessionActive,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          updateQuantity,
          increaseQuantity,
          decreaseQuantity,
          getQuantity,
          getTotalItems,
          getTotalPrice,
          clearCart,
          createOrder,
        }}
      >
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};
