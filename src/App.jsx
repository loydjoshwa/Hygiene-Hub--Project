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
import Addtocart from './Pages/Addtocart'
import Wishlist from './Pages/Wishlist'
import { CartProvider } from './Context/CartContext'

const App = () => {
  return (
    <CartProvider>
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
      <Route path='/register' element={< Register />}/>
      <Route path='/login' element={< Login />}/>
      <Route path='/products' element={<Products />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/addtocart' element={<Addtocart />} />
      <Route path='/Wishlist' element={<Wishlist />} />
      </Routes>
      <ToastContainer />
    </div>
    </CartProvider>
  )
}

export default App
