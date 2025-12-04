import * as Yup from "yup"
import { useFormik } from 'formik'
import register_bg from "../assets/register_bg.png"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../Context/CartContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const loginValidation = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Please enter email"),
    password: Yup.string().required("Enter a password")
  })
 const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      try {
        const res = await axios.get("http://localhost:3130/users");
        const allusers = res.data;

        const user = allusers.find(u => u.email === values.email);
        const userp = allusers.find(u => u.password === values.password);

        if (!user) {
          toast.error("Email not found. Please register first");
          return;
        }

        if (!userp) {
          toast.error("Incorrect password. Please try again");
          return;
        }

        
        login(user);
        
        localStorage.setItem("email", values.email);
        localStorage.setItem("password", values.password);

        toast.success("Login successful");
        navigate("/");

      } catch (error) {
        toast.error("Something went wrong")
        console.log(error)
      }
    }
  })

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${register_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div
        className="p-8 rounded-2xl shadow-lg w-96"
        style={{
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 p-3 rounded-lg bg-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && <span className="text-red-400">{formik.errors.email}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 p-3 rounded-lg bg-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && <span className="text-red-400">{formik.errors.password}</span>}
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-200 mt-4">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-300 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;