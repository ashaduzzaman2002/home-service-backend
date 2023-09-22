const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const { generateOTP, mailTransport, mailTemplete } = require("../utils/mail");
const { validateEmail, jwtSecrect } = require("../utils/helper");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findById(id, "-password");
    if (!user) return res.status(401).json({ message: "Unauthorized access" });
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signupWithEmail = async (req, res) => {
  const { email, name, otp, password, role } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(400).json({ message: "User already exist" });
    const isOtpExist = await Otp.findOne({ email });

    if(!isOtpExist) return res.status(404).json({ message: "Please send otp" });
    if (isOtpExist?.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = new User({
      email,
      name,
      password,
      role,
    });

    await user.save();
    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
};

// OTP Send
exports.sendAuthOtp = async (req, res) => {
  const { email, type } = req.body;

  try {
    if (!email.length)
      return res.status(404).json({ message: "Email is required" });
    if (!validateEmail(email))
      return res.status(404).json({ message: "Invalid email type" });

    const otp = generateOTP();
    // const hashOTP = await bcrypt.hash(otp, 8);

    if (type === "register") {
      const userExist = await User.findOne({ email });

      if (userExist)
        return res.status(404).json({ message: "User already exist" });

      const otpExist = await Otp.findOne({ email });

      if (otpExist) {
        const updatedOtp = await Otp.findByIdAndUpdate(otpExist?._id, {
          otp,
        });

        if (!updatedOtp)
          return res.status(404).json({ message: "OTP not found" });

        mailTransport().sendMail({
          from: "crezytechy@gmail.com",
          to: email,
          subject: "Please verify your email account",
          html: mailTemplete(otp),
        });

        return res.json({ success: true, message: "OTP send successfully" });
      } else {
        const newOtp = new Otp({
          email,
          otp,
        });

        await newOtp.save();

        mailTransport().sendMail({
          from: "crezytechy@gmail.com",
          to: email,
          subject: "Please verify your email account",
          html: mailTemplete(otp),
        });
        return res.json({ success: true, message: "OTP send successfully" });
      }
    } else if (type === "forgot") {
      const userExist = await User.findOne({ email });

      if (!userExist)
        return res.status(404).json({ message: "User doesn't exist" });

      const otpExist = await Otp.findOne({ email });

      if (otpExist) {
        const updatedOtp = await Otp.findByIdAndUpdate(otpExist?._id, {
          otp,
        });

        if (!updatedOtp)
          return res.status(404).json({ message: "OTP not found" });

        mailTransport().sendMail({
          from: "crezytechy@gmail.com",
          to: email,
          subject: "Please verify your email account",
          html: mailTemplete(otp),
        });

        return res.json({ success: true, message: "OTP send successfully" });
      } else {
        const newOtp = new Otp({
          email,
          otp,
        });

        await newOtp.save();

        mailTransport().sendMail({
          from: "crezytechy@gmail.com",
          to: email,
          subject: "Please verify your email account",
          html: mailTemplete(otp),
        });
        return res.json({ success: true, message: "OTP send successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error!");
  }
};

// signup with google
exports.signUpWithGoogle = async (req, res) => {
  const { email, name, role } = req.body;

  try {
    if (!email?.length && !name?.length && !role?.length)
      return res.status(404).json({ message: "All fields are mandatory!" });

    if (!validateEmail(email))
      return res.status(404).json({ message: "Invalid email type" });

    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(404).json({ message: "User already exist" });

    const newUser = new User({
      name,
      email,
      role,
    });

    await newUser.save();

    return res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
};

// Login with google
exports.loginWithGoogle = async (req, res) => {
  const { email, role } = req.body;
  try {
    if (!email?.length)
      return res.status(404).json({ message: "All fields are mandatory!" });

    if (!validateEmail(email))
      return res.status(404).json({ message: "Invalid email type" });

    const userExist = await User.findOne({ email }).select("-password");

    if (!userExist || userExist.role !== role)
      return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: userExist?._id }, jwtSecrect, {
      expiresIn: "7d",
    });

    //  Cookie
    const options = {
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    };

    return res.cookie("token", token, options).json({
      success: true,
      message: "Logged in successfully",
      user: userExist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
};

// login with email password
exports.loginWithEmail = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log(email, password, role)
    if (!email?.length)
      return res.status(404).json({ message: "All fields are mandatory!" });

    if (!validateEmail(email))
      return res.status(404).json({ message: "Invalid email type" });

    const userExist = await User.findOne({ email });

    if (!userExist || userExist.role !== role)
      return res.status(404).json({ message: "User not found" });

    if (userExist?.password !== password)
      return res.status(401).json({ message: "Invalid email/password" });

    const token = jwt.sign({ id: userExist?._id }, jwtSecrect, {
      expiresIn: "7d",
    });

    //  Cookie
    const options = {
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    };

    return res.cookie("token", token, options).json({
      success: true,
      message: "Logged in successfully",
      user: userExist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.addTechnicianDetails = async (req, res) => {
  const {email, location, profession, experience} = req.body

  try {
    const updatedUser = await User.findOneAndUpdate({email}, {
      location, profession, experience
    })

    res.json({success: true, messgae: 'Details added successfully', user: updatedUser})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}