import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generatToken.js";
import { sendEmail } from "../middlewares/otpValidation.js";
// @desc  Auth User/set token
// route  POST  /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Input Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate and set JWT token
    generateToken(res, user._id);

    // Logging
    console.log(`User logged in: ${user.name}, ${user.email}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc  Register new user
// route  POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Input Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  // Check if user with the same email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Generate and set JWT token
    generateToken(res, user._id);

    // Logging
    console.log(`New user registered: ${user.name}, ${user.email}`);

    res.status(201).json({
      _id: user._id,
      name: user.userName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc  Sent Otp
// route  POST  /api/users/sentOtp
// const sentOtpRegister = asyncHandler(async (req, res) => {
//   const email = req.body.email;
//   // Input Validation
//   if (!email) {
//     res.status(400);
//     throw new Error("Email is required.");
//   }

//   // Generate and send OTP
//   const otp = sendEmail(email,res)
//   if(otp){
//  // Logging
//  console.log(`OTP sent to ${email}: ${otp}`);

//  return res.status(200).json(otp);
//   }else{
//     throw new Error("Check your email")
//   }

// });
const sentOtpRegister = asyncHandler(async (req, res) => {
  const email = req.body.email;

  try {
    // Input Validation
    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    // Generate and send OTP
    const otp = await sendEmail(email, res);
    console.log('sendEmail', otp );
    if (otp) {
      // Send a success response without revealing the OTP
      res.status(200).json({ message: "OTP sent to the email address.",otp });

      // Logging
      console.log(`OTP sent to ${email}`);
    } else {
      throw new Error("Check your email");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
});

//@desc   Sent Otp ForgetPassword
//route   POST /api/users/sentOtpForgetpassword
const sentOtpForgotPasword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  // Input Validation
  if (!email) {
    res.status(400);
    throw new Error("Email is required.");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (user) {
    // Generate and send OTP
    const otp = await sendEmail(email, res);
    // Logging
    console.log(`OTP sent for password reset to ${email}: ${otp}`);

    return res.status(200).json({ otp, user });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc   Change password
//route   PATCH  /api/users/updatePassword
const changePassword = asyncHandler(async (req, res) => {
  const { email } = req.body.user;

  // Input Validation
  if (!email || !req.body.password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (user) {
    // Update the user's password
    user.password = req.body.password;
    await user.save();

    // Logging
    console.log(`Password changed for user: ${user.name}, ${user.email}`);

    res.status(200).json({ user });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc  Logout user and clear cookie
// route  POST /api/users/logout
const logoutUser = (req, res) => {
  // Clear the JWT cookie

  // Input Validation
  if (!res.cookie) {
    res.status(400);
    throw new Error("No JWT cookie found.");
  }

  // Clear the JWT cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Logging
  console.log("User logged out");

  res.status(200).json({ message: "User logged out" });
};
export {
  loginUser,
  registerUser,
  logoutUser,
  sentOtpForgotPasword,
  sentOtpRegister,
  changePassword,
};
