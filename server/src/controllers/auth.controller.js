import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ==========================
// GENERATE JWT + SET COOKIE
// ==========================
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,      
    sameSite: "none",    
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};


// ==========================
// REGISTER USER
// ==========================
export const register = async (req, res) => {
  const { shopName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      shopName,
      email,
      password, // hashed via pre-save hook
    });

    generateToken(res, user._id);

    res.status(201).json({
      message: "Registered successfully",
      _id: user._id,
      shopName: user.shopName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================
// LOGIN USER
// ==========================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id);

    res.json({
      message: "Logged in successfully",
      _id: user._id,
      shopName: user.shopName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================
// GET CURRENT USER (COOKIE AUTH)
// ==========================
export const getMe = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ==========================
// LOGOUT USER
// ==========================
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Logged out" });
};
