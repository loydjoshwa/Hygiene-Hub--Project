import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from '../Context/CartContext';



const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, createOrder } = useCart();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),

    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),

    address: Yup.string().required("Address is required"),

    state: Yup.string().required("State is required"),

    pincode: Yup.string()
      .matches(/^\d{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),

    cardNumber: Yup.string()
      .matches(/^\d{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),

    cardName: Yup.string().required("Cardholder name is required"),

    expiryDate: Yup.string()
      .matches(/^\d{2}\/\d{2}$/, "Expiry must be MM/YY format")
      .required("Expiry date is required"),

    cvv: Yup.string()
      .matches(/^\d{3}$/, "CVV must be 3 digits")
      .required("CVV is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      address: "",
      state: "",
      pincode: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },

    validationSchema,
    

    onSubmit: async (values) => {
       const updatedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!updatedUser) {
    console.log("user not logged in")
    navigate("/login");
    return;
  }

  
  if (!currentUser) {
    toast.error("user not logged in");
    navigate("/login");
    return;
  }

      setLoading(true);
      
      try {
        
       
        const orderData = {
          orderId: `ORD${Date.now().toString().slice(-6)}`,
          userId: currentUser?.id || 'guest',
          userName: values.fullName,
          userEmail: currentUser?.email || 'guest@example.com',
          userPhone: values.phone,
          shippingAddress: {
            address: values.address,
            state: values.state,
            pincode: values.pincode
          },
          paymentMethod: 'card',
          paymentDetails: {
            cardLastFour: values.cardNumber.slice(-4),
            cardName: values.cardName
          },
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal: getTotalPrice(),
          shipping: shippingCost,
          total: finalTotal,
          orderDate: new Date().toISOString(),
          status: 'confirmed'
        };

       
        await createOrder(orderData);
        
        
        await clearCart();

        toast.success(
          <div>
            <div className="font-bold"> Order Placed Successfully!</div>
            
          </div>,
          {
            autoClose: 4000,
            position: "top-center"
          }
        );

        setLoading(false);
        
        
        setTimeout(() => navigate("/"), 1000);
      } catch (error) {
        console.error('Order failed:', error);
        toast.error('Failed to place order. Please try again.');
        setLoading(false);
      }
    },
  });

  const shippingCost = cartItems.length > 0 ? 40 : 0;
  const finalTotal = getTotalPrice() + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-3 border-b">
                  <div className="flex gap-3">
                    <img src={item.image} alt="" className="w-12 h-12 bg-gray-100 rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}

              <div className="mt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <form onSubmit={formik.handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                <label>Full Name *</label>
                <input
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="Enter full name"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-600 text-sm">{formik.errors.fullName}</p>
                )}

                <label className="mt-4 block">Phone Number *</label>
                <input
                  name="phone"
                  maxLength="10"
                  value={formik.values.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formik.setFieldValue("phone", v);
                  }}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="10 digit phone"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-600 text-sm">{formik.errors.phone}</p>
                )}

                <label className="mt-4 block">Full Address *</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="House, Street, Area"
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-600 text-sm">{formik.errors.address}</p>
                )}

                <label className="mt-4 block">State *</label>
                <input
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="State"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-600 text-sm">{formik.errors.state}</p>
                )}

                <label className="mt-4 block">Pincode *</label>
                <input
                  name="pincode"
                  maxLength="6"
                  value={formik.values.pincode}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    formik.setFieldValue("pincode", v);
                  }}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="6 digit pincode"
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <p className="text-red-600 text-sm">{formik.errors.pincode}</p>
                )}

                <h2 className="text-xl font-bold mt-8 mb-4">Card Payment Details</h2>

                <label>Card Number *</label>
                <input
                  name="cardNumber"
                  maxLength="16"
                  value={formik.values.cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    formik.setFieldValue("cardNumber", v);
                  }}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="16 digit card number"
                />
                {formik.touched.cardNumber && formik.errors.cardNumber && (
                  <p className="text-red-600 text-sm">{formik.errors.cardNumber}</p>
                )}

                <label className="mt-4 block">Cardholder Name *</label>
                <input
                  name="cardName"
                  value={formik.values.cardName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="Name on card"
                />
                {formik.touched.cardName && formik.errors.cardName && (
                  <p className="text-red-600 text-sm">{formik.errors.cardName}</p>
                )}

                <label className="mt-4 block">Expiry Date (MM/YY) *</label>
                <input
                  name="expiryDate"
                  maxLength="5"
                  value={formik.values.expiryDate}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                    formik.setFieldValue("expiryDate", v);
                  }}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="MM/YY"
                />
                {formik.touched.expiryDate && formik.errors.expiryDate && (
                  <p className="text-red-600 text-sm">{formik.errors.expiryDate}</p>
                )}

                <label className="mt-4 block">CVV *</label>
                <input
                  name="cvv"
                  maxLength="3"
                  value={formik.values.cvv}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                    formik.setFieldValue("cvv", v);
                  }}
                  onBlur={formik.handleBlur}
                  className="input-field"
                  placeholder="123"
                />
                {formik.touched.cvv && formik.errors.cvv && (
                  <p className="text-red-600 text-sm">{formik.errors.cvv}</p>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="border border-green-600 text-green-600 px-6 py-3 rounded-lg"
                  >
                    Back to Cart
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg"
                  >
                    {loading ? "Processing..." : `Pay ₹${finalTotal}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="font-bold text-lg mb-4">Order Information</h3>
            <p className="text-sm">Secure Payment ✓</p>
            <p className="text-sm">Easy Returns ✓</p>
            <p className="text-sm">24/7 Support ✓</p>

            <div className="mt-4 bg-green-50 p-3 rounded">
              <p className="font-bold">Delivery Estimate</p>
              <p className="text-sm">3–5 business days</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;