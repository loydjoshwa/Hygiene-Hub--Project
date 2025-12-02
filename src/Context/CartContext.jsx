import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const AuthContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
}; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Fetch cart items for current user
  useEffect(() => {
    if (currentUser) {
      fetchUserCartItems();
      fetchUserWishlistItems();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [currentUser]);

  // Auth functions
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

  // Fetch cart items for current user from JSON Server
  const fetchUserCartItems = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('http://localhost:3130/cart');
      const allCartItems = await response.json();
      // Filter cart items for current user
      const userCartItems = allCartItems.filter(item => item.userId === currentUser.id);
      setCartItems(userCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  // Fetch wishlist items for current user from JSON Server
  const fetchUserWishlistItems = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('http://localhost:3130/wishlist');
      const allWishlistItems = await response.json();
      // Filter wishlist items for current user
      const userWishlistItems = allWishlistItems.filter(item => item.userId === currentUser.id);
      setWishlistItems(userWishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      setWishlistItems([]);
    }
  };

  // Add item to cart for current user
  const addToCart = async (product) => {
    if (!currentUser) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        await fetch(`http://localhost:3130/cart/${existingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: existingItem.quantity + 1
          })
        });
      } else {
        await fetch('http://localhost:3130/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1,
            userId: currentUser.id
          })
        });
      }
      
      fetchUserCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Add item to wishlist for current user
  const addToWishlist = async (product) => {
    if (!currentUser) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      const existingItem = wishlistItems.find(item => item.productId === product.id);
      
      if (!existingItem) {
        await fetch('http://localhost:3130/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            userId: currentUser.id
          })
        });
        fetchUserWishlistItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  // Remove from wishlist for current user
  const removeFromWishlist = async (productId) => {
    try {
      const wishlistItem = wishlistItems.find(item => 
        item.productId === productId && item.userId === currentUser?.id
      );
      if (wishlistItem) {
        await fetch(`http://localhost:3130/wishlist/${wishlistItem.id}`, {
          method: 'DELETE'
        });
        fetchUserWishlistItems();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Remove item from cart for current user
  const removeFromCart = async (productId) => {
    try {
      const cartItem = cartItems.find(item => 
        item.productId === productId && item.userId === currentUser?.id
      );
      if (cartItem) {
        await fetch(`http://localhost:3130/cart/${cartItem.id}`, {
          method: 'DELETE'
        });
        fetchUserCartItems();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update item quantity for current user
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      const cartItem = cartItems.find(item => 
        item.productId === productId && item.userId === currentUser?.id
      );
      if (cartItem) {
        await fetch(`http://localhost:3130/cart/${cartItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        });
        fetchUserCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Increase quantity by 1
  const increaseQuantity = (productId) => {
    const currentItem = cartItems.find(item => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + 1);
    }
  };

  // Decrease quantity by 1
  const decreaseQuantity = (productId) => {
    const currentItem = cartItems.find(item => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity - 1);
    }
  };

  // Get quantity of specific item
  const getQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Get total number of items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items in cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Clear entire cart for current user
  const clearCart = async () => {
    try {
      const userCartItems = cartItems.filter(item => item.userId === currentUser?.id);
      await Promise.all(
        userCartItems.map(item => 
          fetch(`http://localhost:3130/cart/${item.id}`, {
            method: 'DELETE'
          })
        )
      );
      fetchUserCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Store order in database
  const createOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:3130/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          orderDate: new Date().toISOString(),
          status: 'confirmed'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Check if product is in wishlist for current user
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.productId === productId && item.userId === currentUser?.id
    );
  };

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