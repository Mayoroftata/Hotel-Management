import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/auth.js";

const register = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  console.log("Registration details:", req.body); // Debugging line

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      role: "user", // Default role
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      status: "201",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login details:", req.body); // Debugging line

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    if (!password || !user.password) {
      return res.status(400).json({
        message:
          user.authProvider === "google"
            ? "This account uses Google sign-in. Please continue with Google."
            : "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    // 4. Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google sign-in is not configured" });
    }

    const verificationResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
    );

    if (!verificationResponse.ok) {
      return res.status(401).json({ message: "Invalid Google credential" });
    }

    const googleUser = await verificationResponse.json();

    if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google credential audience mismatch" });
    }

    if (googleUser.email_verified !== "true" && googleUser.email_verified !== true) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    const email = googleUser.email?.toLowerCase();
    const nameParts = (googleUser.name || email).split(" ");
    const firstName = googleUser.given_name || nameParts[0] || "Google";
    const lastName = googleUser.family_name || nameParts.slice(1).join(" ") || "User";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        phoneNumber: "0000000000",
        email,
        authProvider: "google",
        googleId: googleUser.sub,
        avatar: googleUser.picture,
        role: "user",
      });
    } else {
      user.authProvider = user.authProvider || "google";
      user.googleId = user.googleId || googleUser.sub;
      user.avatar = googleUser.picture || user.avatar;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(500).json({ message: "Server error during Google login" });
  }
};

export { register, login, googleLogin };
