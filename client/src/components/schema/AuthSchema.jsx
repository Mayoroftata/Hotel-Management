"use client"

import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Required"),
  password: yup
    .string()
    .required("Required")
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

export const registerSchema = yup.object().shape({
    firstName: yup
    .string()
    .required("First name is required"),

    lastName: yup
    .string()
    .required("Last name is required"),

    phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),

    email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

    password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(passwordRegex, { message: "Please create a stronger password" })
    .required("Password is required"),

    confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});