const User = require("../models/User");
const OtpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//send otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    //check user exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists,try to login",
      });
    }
    let otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp", otp);

    //check for unique otp
    let checkUniqueOtp = await Otp.findOne({ otp });
    while (checkUniqueOtp) {
      otp = OtpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      checkUniqueOtp = await Otp.findOne({ otp });
    }
    const otpObj = await Otp.create({ email, otp });
    console.log("otp body", otpObj);
    return res.status(200).json({
      success: true,
      message: "Otp generated successfully",
      otp,
    });
  } catch (error) {
    console.log("error while sending otp", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;
    //validate info
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Enter all the details",
      });
    }
    //check passwords
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Passwords does'nt match",
      });
    }
    //check user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    //fetch otp
    let fetchOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("fecth otp", fetchOtp);
    //validate otp
    if (fetchOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== fetchOtp) {
      return res.status(400).json({
        success: false,
        message: "Otp does not match",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create user in db
    const ProfileDetails = await Profile.create({
      displayName: null,
      profession: null,
      dateOfBirth: null,
      gender: null,
      about: null,
    });
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      profile: ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("error while signing up", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//login
exports.logIn = async (req, res) => {
  try {
    const { email, password, accountType } = req.body;
    const user = await User.findOne({ email });
    //validate details
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    //check user present
    if (!user) {
      return res.staus(400).json({
        success: false,
        message: "User not found,Please signup",
      });
    }
    //check for password
    const isPasswordMatch = await bcrypt.compare(
      password,
      checkUserPresent.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Passsword incorrect",
      });
    }
    //generate jwt and cookie

    //jwt
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = await JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;

    //cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error while logging in", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//change password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    //validate details
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    //check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found,please signup first",
      });
    }
    //match password from db
    if (await bcrypt(oldPassword, user.password)) {
      //validate new passwords
      if (newPassword !== confirmNewPassword)
        return res.status(400).json({
          success: false,
          message: "Passwords does not match",
        });
      //hash password
      const hashedPassword = await bcrypt(newPassword, 10);
      //update in db
      const updateUserInDB = await User.findOneAndUpdate({email:email},{password:hashedPassword},{new:true});

      //send email pw changes
      await mailSender(
        "CodeHelp-Password Changed",
        `<html><p>password changed</p></html>`,
        email
      );
      //send res
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        user:updateUserInDB
      });
    }
    return res.status(400).json({
      success: false,
      message: "Password does not match",
    });
  } catch (error) {
    console.log("error while changing password", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    //validation
    if (!email)
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    const user = await User.find({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "email not found",
      });

    //generate token
    const token = crypto.randomUUID();
    //update user token in db
    const updateUserDet = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        passwordExpiresIn: 5 * 60 * 1000,
      },
      { new: true }
    );

    //generate fe url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail
    await mailSender("Password reset Link-CodeHelp", url, email);
    //send res
    res.status(200).json({
      success: true,
      message: "Token generated successfully",
      user: updateUserDet,
    });
  } catch (error) {
    console.log("error in reset password token", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    //validation
    const user = await User.findOne({ token: token });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Token invalid",
      });
    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Passwords does not match",
      });
    //check for token expiration
    if (user.passwordExpiresIn < Date.now())
      return res.status(400).json({
        success: false,
        message: "Link expired",
      });

    //hash the password
    const hashedPassword = await bcrypt(password, 10);
    //update user det in db
    const updateUserDet = await User.findOneAndUpdate(
      { toke: token },
      { password: hashedPassword },
      { new: true }
    );
    //send res
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      user: updateUserDet,
    });
  } catch (error) {
    console.log("error while resetting passwird", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
