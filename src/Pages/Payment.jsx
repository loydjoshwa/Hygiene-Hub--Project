import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // ------------------ Yup Validation Schema -------------------
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
      .matches(/^\d{2}\/\d{2}$/, "Expiry must be in MM/YY format")
      .required("Expiry date is required"),

    cvv: Yup.string()
      .matches(/^\d{3}$/, "CVV must be 3 digits")
      .required("CVV is required"),
  });

  // Shipping + Total
  const shippingCost = cartItems.length > 0 ? 40 : 0;
  const finalTotal = getTotalPrice() + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* ================= LEFT SECTION ================= */}
          <div className="lg:col-span-2">

            {/* ---------------- ORDER SUMMARY ---------------- */}
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

            {/* ---------------- FORM USING FORMIK ---------------- */}
            <div className="bg-white p-6 rounded-lg shadow">

              <Formik
                initialValues={{
                  fullName: "",
                  phone: "",
                  address: "",
                  state: "",
                  pincode: "",
                  cardNumber: "",
                  cardName: "",
                  expiryDate: "",
                  cvv: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  setLoading(true);

                  setTimeout(() => {
                    clearCart();

                    toast.success("🎉 Order Placed Successfully!", {
                      autoClose: 3000,
                      position: "top-center"
                    });

                    setLoading(false);

                    setTimeout(() => navigate("/"), 1500);
                  }, 1500);
                }}
              >
                {({ errors, touched, setFieldValue }) => (
                  <Form>
                    {/* -------- Delivery Address -------- */}
                    <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                    {/* FULL NAME */}
                    <label>Full Name *</label>
                    <Field
                      name="fullName"
                      className="input-field"
                      placeholder="Enter full name"
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-red-600 text-sm">{errors.fullName}</p>
                    )}

                    {/* PHONE */}
                    <label className="mt-4 block">Phone Number *</label>
                    <Field
                      name="phone"
                      maxLength="10"
                      className="input-field"
                      placeholder="10 digit phone"
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFieldValue("phone", v);
                      }}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-600 text-sm">{errors.phone}</p>
                    )}

                    {/* ADDRESS */}
                    <label className="mt-4 block">Full Address *</label>
                    <Field
                      as="textarea"
                      name="address"
                      rows="3"
                      className="input-field"
                      placeholder="House, Street, Area"
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-600 text-sm">{errors.address}</p>
                    )}

                    {/* STATE */}
                    <label className="mt-4 block">State *</label>
                    <Field
                      name="state"
                      className="input-field"
                      placeholder="State"
                    />
                    {errors.state && touched.state && (
                      <p className="text-red-600 text-sm">{errors.state}</p>
                    )}

                    {/* PINCODE */}
                    <label className="mt-4 block">Pincode *</label>
                    <Field
                      name="pincode"
                      maxLength="6"
                      className="input-field"
                      placeholder="6 digit pincode"
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setFieldValue("pincode", v);
                      }}
                    />
                    {errors.pincode && touched.pincode && (
                      <p className="text-red-600 text-sm">{errors.pincode}</p>
                    )}

                    {/* -------- Payment Section -------- */}
                    <h2 className="text-xl font-bold mt-8 mb-4">Card Payment Details</h2>

                    {/* CARD NUMBER */}
                    <label>Card Number *</label>
                    <Field
                      name="cardNumber"
                      maxLength="16"
                      className="input-field"
                      placeholder="16 digit card number"
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setFieldValue("cardNumber", v);
                      }}
                    />
                    {errors.cardNumber && touched.cardNumber && (
                      <p className="text-red-600 text-sm">{errors.cardNumber}</p>
                    )}

                    {/* CARD HOLDER NAME */}
                    <label className="mt-4 block">Cardholder Name *</label>
                    <Field
                      name="cardName"
                      className="input-field"
                      placeholder="Name on card"
                    />
                    {errors.cardName && touched.cardName && (
                      <p className="text-red-600 text-sm">{errors.cardName}</p>
                    )}

                    {/* EXPIRY DATE */}
                    <label className="mt-4 block">Expiry Date (MM/YY) *</label>
                    <Field
                      name="expiryDate"
                      maxLength="5"
                      className="input-field"
                      placeholder="MM/YY"
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                        setFieldValue("expiryDate", v);
                      }}
                    />
                    {errors.expiryDate && touched.expiryDate && (
                      <p className="text-red-600 text-sm">{errors.expiryDate}</p>
                    )}

                    {/* CVV */}
                    <label className="mt-4 block">CVV *</label>
                    <Field
                      name="cvv"
                      maxLength="3"
                      className="input-field"
                      placeholder="123"
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                        setFieldValue("cvv", v);
                      }}
                    />
                    {errors.cvv && touched.cvv && (
                      <p className="text-red-600 text-sm">{errors.cvv}</p>
                    )}

                    {/* BUTTONS */}
                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/addtocart")}
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
                  </Form>
                )}
              </Formik>

            </div>
          </div>

          {/* ================= RIGHT SECTION ================= */}
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
