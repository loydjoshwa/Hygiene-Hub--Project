import React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import register_bg from "../assets/register_bg.png";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // Yup validation schema
  const signupValidation = Yup.object({
    username: Yup.string()
      .min(3, "Minimum 3 characters needed")
      .required("Please enter username"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Please enter email"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Please enter password"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required")
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      cpassword: ""
    },
    validationSchema: signupValidation,
    onSubmit: async (values) => {
      try {
        // Check if email already exists
        const res = await axios.get("http://localhost:3130/users");
        const emailList = res.data.map((user) => user.email);

        if (emailList.includes(values.email)) {
          toast.error("Email already exists. Please login.");
          return;
        }

        //save newuseer
        await axios.post("http://localhost:3130/users", {
          username: values.username,
          email: values.email,
          password: values.password
        });

        toast.success("Registered Successfully!");
        navigate("/login");

      } catch (err) {
        toast.error("Something went wrong. Try again.");
        console.error(err);
      }
    }
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${register_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="p-8 rounded-2xl shadow-lg w-96"
        style={{
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Register</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                className="w-full border p-3 rounded-lg bg-white"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <span className="text-red-400">{formik.errors.username}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full border p-3 rounded-lg bg-white"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-400">{formik.errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full border p-3 rounded-lg bg-white"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-400">{formik.errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="cpassword"
                placeholder="Confirm password"
                className="w-full border p-3 rounded-lg bg-white"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.cpassword}
              />
              {formik.touched.cpassword && formik.errors.cpassword && (
                <span className="text-red-400">{formik.errors.cpassword}</span>
              )}
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-200 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
