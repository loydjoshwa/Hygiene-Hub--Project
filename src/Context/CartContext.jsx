import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";   

const CartContext = createContext();
const AuthContext = createContext();

export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserCartItems();
      fetchUserWishlistItems();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [currentUser]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setWishlistItems([]);
    localStorage.removeItem('currentUser');
  };

  const fetchUserCartItems = async () => {
    if (!currentUser) return;
    try {
      const { data }  = await axios.get("http://localhost:3130/cart");
      const userItems = data.filter(item => item.userId === currentUser.id);
      setCartItems(userItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  };

  const fetchUserWishlistItems = async () => {
    if (!currentUser) return;
    try {
      const { data } = await axios.get("http://localhost:3130/wishlist");
      const userItems = data.filter(item => item.userId === currentUser.id);
      setWishlistItems(userItems);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setWishlistItems([]);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) throw new Error("Please login");

    try {
      const existing = cartItems.find(item => item.productId === product.id);

      if (existing) {
        await axios.patch(`http://localhost:3130/cart/${existing.id}`, {
          quantity: existing.quantity + 1
        });
      } else {
        await axios.post("http://localhost:3130/cart", {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
          userId: currentUser.id
        });
      }

      fetchUserCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const addToWishlist = async (product) => {
    if (!currentUser) throw new Error("Please login");

    try {
      const exists = wishlistItems.find(item => item.productId === product.id);

      if (!exists) {
        await axios.post("http://localhost:3130/wishlist", {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          userId: currentUser.id
        });
        fetchUserWishlistItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const item = wishlistItems.find(
        i => i.productId === productId && i.userId === currentUser?.id
      );
      if (item) {
        await axios.delete(`http://localhost:3130/wishlist/${item.id}`);
        fetchUserWishlistItems();
      }
    } catch (error) {
      console.error("Error removing wishlist:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const item = cartItems.find(
        i => i.productId === productId && i.userId === currentUser?.id
      );
      if (item) {
        await axios.delete(`http://localhost:3130/cart/${item.id}`);
        fetchUserCartItems();
      }
    } catch (error) {
      console.error("Error removing cart:", error);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return removeFromCart(productId);

    try {
      const item = cartItems.find(
        i => i.productId === productId && i.userId === currentUser?.id
      );
      if (item) {
        await axios.patch(`http://localhost:3130/cart/${item.id}`, {
          quantity: newQty
        });
        fetchUserCartItems();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item) updateQuantity(productId, item.quantity - 1);
  };

  const getQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () =>
    cartItems.reduce((t, i) => t + i.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      const { data } = await axios.get("http://localhost:3130/cart");
      const userItems = data.filter(i => i.userId === currentUser.id);

      await Promise.all(
        userItems.map(item =>
          axios.delete(`http://localhost:3130/cart/${item.id}`)
        )
      );

      setCartItems([]);
      fetchUserCartItems();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const { data } = await axios.post("http://localhost:3130/orders", {
        ...orderData,
        orderDate: new Date().toISOString(),
        status: "confirmed"
      });
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some(i => i.productId === productId);

  const cartValue = {
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
    createOrder
  };

  const authValue = {
    currentUser,
    login,
    logout,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount: () => wishlistItems.length
  };

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};
