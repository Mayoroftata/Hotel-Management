"use client";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "../../components/schema/AuthSchema.jsx";
import { PulseLoader } from "react-spinners";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const googleButtonRef = useRef(null);

  // Get redirect URL from query params
  const redirect = searchParams.get("redirect") || "/profile";

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token is still valid (optional - could add API call here)
      router.replace(redirect);
    } else {
      setIsChecking(false);
    }
  }, [router, redirect]);

  // Success Toast
  const showSuccessToast = (message) => {
    toast.success(message);
  };

  // Error Toast
  const showErrorToast = (message) => {
    toast.error(message);
  };

  const handleAuthSuccess = (data, message) => {
    showSuccessToast(message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setTimeout(() => {
      setIsLoading(false);
      router.replace(redirect);
    }, 1000);
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    console.log("Form submitted", values);
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", values);
      console.log(res.data);

      if (res.status === 200) {
        resetForm();
        setSubmitting(false);
        handleAuthSuccess(res.data, res.data.message || "Login successful");
      } else {
        setIsLoading(false);
        setSubmitting(false);
        showErrorToast(res.data.message || "User does not exist");
      }
    } catch (err) {
      setIsLoading(false);
      setSubmitting(false);
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        showErrorToast(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        showErrorToast("Invalid email or password");
      } else if (err.code === "ERR_NETWORK") {
        showErrorToast(
          "Cannot connect to server. Please check your connection.",
        );
      } else {
        showErrorToast("Something went wrong. Please try again.");
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

  // 'handleGoogleCredential' moved into useEffect below to avoid
  // changing the effect dependencies on every render.

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 260,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => showErrorToast("Could not load Google sign-in");
    document.body.appendChild(script);
  }, [redirect]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="justify-center flex items-center min-h-screen bg-blue-900">
        <div className="text-white text-center">
          <PulseLoader color="#fff" size={15} />
          <p className="mt-4">Checking login status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            DEELUCK
          </Link>
        </div>
      </nav>

      <div className="justify-center flex items-center min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-900 to-blue-800 py-12 px-4">
        <div className="bg-white w-full max-w-lg mx-6 rounded-2xl shadow-2xl">
          <div className="px-8 pb-8">
            <div className="text-center mb-8">
              <h1 className="font-bold text-blue-900 text-3xl mt-8 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue to your account
              </p>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  className={`p-3 w-full border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.email && touched.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-900 focus:border-blue-900"
                  }`}
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  name="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  className={`p-3 w-full border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.password && touched.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-900 focus:border-blue-900"
                  }`}
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-900 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="font-bold rounded-lg text-white w-full bg-blue-900 py-3 hover:bg-blue-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <PulseLoader size={13} color="#fff" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/register${redirect ? `?redirect=${redirect}` : ""}`}
                  className="text-blue-900 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="flex items-center space-x-2 my-6">
              <hr className="flex-1 border-gray-300" />
              <p className="text-center text-gray-500 text-sm">
                or continue with
              </p>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="flex justify-center">
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                <div ref={googleButtonRef} />
              ) : (
                <button
                  type="button"
                  disabled
                  className="bg-white border border-gray-300 rounded-lg px-6 py-2 flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                >
                  <Image
                    alt="Google"
                    src="/images/google.svg"
                    width={23}
                    height={23}
                  />
                  <span className="text-black font-medium">
                    Google sign-in not configured
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
