"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import axios from "axios";

// Simple login validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/login", values);
      
      if (response.status === 200) {
        // Check if user is admin
        const user = response.data.user;
        
        if (user.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        
        toast.success("Login successful! Redirecting to admin dashboard...");
        
        resetForm();
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          setIsLoading(false);
          router.push("/admin");
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit,
    });

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white w-full max-w-lg mx-6 rounded-lg shadow-xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Admin Login
          </h1>
          
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? <PulseLoader size={10} color="#fff" /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;