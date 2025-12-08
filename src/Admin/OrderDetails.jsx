// OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft, Calendar, Phone, MapPin, CreditCard, Package, Truck, CheckCircle, User, Mail, Home, ChevronRight } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:3130/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load order');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:3130/orders/${id}`, {
        status: newStatus
      });
      
      setOrder({ ...order, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200',
      confirmed: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200',
      processing: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200',
      cancelled: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle className="w-5 h-5" />,
      confirmed: <Package className="w-5 h-5" />,
      processing: <Truck className="w-5 h-5" />,
      cancelled: <XCircle className="w-5 h-5" />
    };
    return icons[status] || <Package className="w-5 h-5" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-[3px] border-[#00CAFF] border-t-[#4300FF]"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00CAFF]/10 to-[#00FFDE]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#0065F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
            <Link 
              to="/admin/orders" 
              className="px-6 py-3 bg-gradient-to-r from-[#4300FF] to-[#0065F8] text-white rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <Link 
            to="/admin/orders" 
            className="inline-flex items-center gap-2 text-[#0065F8] hover:text-[#4300FF] mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4300FF] to-[#00CAFF] bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-gray-600 mt-2">Order ID: <span className="font-mono font-semibold text-[#0065F8]">{order.orderId}</span></p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="text-lg">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
              
              <select 
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
              >
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Package className="w-7 h-7 text-[#0065F8]" />
                  Order Items
                </h2>
                <div className="text-sm text-gray-500">
                  {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-6">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: ₹{item.price} each</p>
                      </div>
                    </div>
                    <p className="font-bold text-xl text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="space-y-3 max-w-md ml-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹{order.shipping}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200 mt-4">
                    <span>Total Amount</span>
                    <span className="bg-gradient-to-r from-[#00FFDE] to-[#00CAFF] bg-clip-text text-transparent text-2xl">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information Sidebar */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-[#0065F8]" />
                Customer Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00CAFF] to-[#00FFDE] rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-bold text-gray-800">{order.userName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4300FF]/10 to-[#0065F8]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#0065F8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{order.userEmail}</p>
                  </div>
                </div>
                
                {order.userPhone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00FFDE]/10 to-[#00CAFF]/10 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#00CAFF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{order.userPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#0065F8]" />
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4300FF]/10 to-[#0065F8]/10 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#4300FF]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{order.shippingAddress?.address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium text-gray-800">{order.shippingAddress?.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pincode</p>
                    <p className="font-medium text-gray-800">{order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#0065F8]" />
                Order Info
              </h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00FFDE]/10 to-[#00CAFF]/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#00FFDE]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-800">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0065F8]/10 to-[#4300FF]/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#0065F8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-800">{order.paymentMethod?.toUpperCase()}</p>
                  </div>
                </div>
                
                {order.paymentMethod === 'upi' && order.paymentDetails?.upiId && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">UPI ID</p>
                    <p className="font-medium text-gray-800">{order.paymentDetails.upiId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;