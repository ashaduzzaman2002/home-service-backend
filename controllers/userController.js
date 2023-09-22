const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const { generateOTP, mailTransport, mailTemplete } = require("../utils/mail");
const { validateEmail } = require("../utils/helper");
const User = require("../models/User");

exports.signupWithEmail = async (req, res) => {
  const { email, name, otp, password, role } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) return res.json();
  } catch (error) {
    console.log(error);
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
    const hashOTP = await bcrypt.hash(otp, 8);

    if (type === "register") {
      const userExist = await User.findOne({ email });

      if (userExist)
        return res.status(404).json({ message: "User already exist" });

      const otpExist = await Otp.findOne({ email });

      if (otpExist) {
        const updatedOtp = await Otp.findByIdAndUpdate(otpExist?._id, {
          otp: hashOTP,
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
          otp: hashOTP,
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
          otp: hashOTP,
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
          otp: hashOTP,
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
    req.status(500).josn("Internal server error!");
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
  }
};
