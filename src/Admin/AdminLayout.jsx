// AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  LayoutDashboard,  Package, Users,  ShoppingBag,
          Menu, X,  LogOut, Home, ChevronRight } from 'lucide-react';


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverSidebar, setHoverSidebar] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully!");
    window.location.href = '/login';
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <Package className="w-5 h-5" />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="w-5 h-5" />
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00CAFF]/5 to-[#4300FF]/5">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#4300FF] to-[#0065F8] text-white transform transition-all duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-20 hover:w-64 group transition-all duration-300`}
        onMouseEnter={() => {setHoverSidebar(true); setSidebarOpen(true)}}
        onMouseLeave={() => {setHoverSidebar(false); setSidebarOpen(false)}}
      >
        <div className="h-20 border-b border-white/20 flex items-center px-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00FFDE] to-[#00CAFF] rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-lg">
            H
          </div>
          <div className="ml-4 flex-1 transition-all duration-300 group-hover:opacity-100 opacity-0 lg:opacity-0 lg:group-hover:opacity-100">
            <span className="font-bold text-xl bg-gradient-to-r from-[#00FFDE] to-[#00CAFF] bg-clip-text text-transparent">
              HygieneHub
            </span>
            <p className="text-xs text-white/70 mt-1">Admin Panel</p>
          </div>
        </div>
        
        <nav className="p-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  <div className={`transition-transform ${isActive(item.path) ? 'scale-110' : ''}`}>
                    {React.cloneElement(item.icon, { 
                      className: `w-5 h-5 ${isActive(item.path) ? 'text-[#00FFDE]' : ''}`
                    })}
                  </div>
                  <span className="whitespace-nowrap overflow-hidden transition-all font-medium">
                    {item.name}
                  </span>
                  {isActive(item.path) && (
                    <div className="absolute right-4 w-2 h-2 bg-[#00FFDE] rounded-full animate-pulse"></div>
                  )}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
            
            <li className="pt-6 mt-6 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 text-white/90 w-full text-left transition-all group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="whitespace-nowrap overflow-hidden font-medium">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>

      </div>

      
      <div className="lg:ml-20 transition-all duration-300">
       
        <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-[#00CAFF]/20">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-[#4300FF] to-[#0065F8] text-white hover:shadow-lg transition-all"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-4">
                <Home className="w-5 h-5 text-[#0065F8]" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4300FF] to-[#00CAFF] bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00FFDE] rounded-full animate-pulse"></span>
                    HygieneHub Store Management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

    
        <main className="p-6 md:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#00CAFF]/20 p-1 min-h-[calc(100vh-180px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;