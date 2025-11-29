import React from 'react'
import Register from './Pages/Register'
import "./App.css"
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Products from './Pages/Products'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
      <Route path='/register' element={< Register />}/>
      <Route path='/login' element={< Login />}/>
      <Route path='/products' element={<Products />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
