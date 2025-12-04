import React from 'react'
import Register from './Pages/Register'
import "./App.css"
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Products from './Pages/Products'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Wishlist from './Pages/Wishlist'
import { CartProvider } from './Context/CartContext'
import Payment from './Pages/Payment'

import ProtectedRoute from './Routes/ProtectedRoute'
import PublicRoute from './Routes/PublicRoute'
import Navbar from './components/Navbar'
import MyOrders from './Pages/Myorders'

const App = () => {
  return (
    <CartProvider>
      
      <Routes>

        {/* Public Route ❌ No Navbar */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />


        {/* Protected Route + Navbar Wrap */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route 
          path="/products" 
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        <Route 
          path="/about" 
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />

        <Route 
          path="/contact" 
          element={
            <>
              <Navbar />
              <Contact />
            </>
          }
        />

        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route 
  path="/myorders"
  element={
    <ProtectedRoute>
      <Navbar />
      <MyOrders />
    </ProtectedRoute>
  }
/>

      </Routes>

      <ToastContainer />

    </CartProvider>
  );
};

export default App;

