const JWT = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        messsage: "token not found,authorisation failed",
      });
    }
    //verify token
    try {
      const decode = await JWT.verify(token, process.env.JWT_SECRET);
      console.log("decode", decode);
      req.user = decode;
      res.status(200).json({
        success: true,
        message: "Token authorised successfully",
      });
    } catch (error) {
      console.log("error while validating token", error);
      res.status(400).json({
        successs: false,
        message: "Token is unauthorised",
      });
    }
    next();
  } catch (error) {
    console.log("error in auth middleware", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//is student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(400).json({
        success: false,
        message: "You are not authorised for this account",
      });
    }
    next();
  } catch (error) {
    console.log("error at student middleware", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//is instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "You are not authorised for this account",
      });
    }
    next();
  } catch (error) {
    console.log("error at instructor middleware");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "You are not authorised for this account",
      });
    }
    next();
  } catch (error) {
    console.log("error at admin miidleware");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
