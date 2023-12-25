const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { registrationEmail } = require("../templates/registrationEmail");

//create order
exports.capturePayment = async (req, res) => {
  try {
    const { course_id } = req.body;
    const userID = req.user.id;
    //validate course id
    if (!course_id)
      return res.status(400).json({
        success: false,
        message: "Please provide valid course id",
      });
    //validate course
    let course = await Course.findById({ course_id });
    if (!course)
      return res.json({
        success: false,
        message: "Course not found",
      });
    //validate user
    let uid = new mongoose.Types.ObjectId(userID);
    if (course.studentsEnrolled.includes(uid))
      return res.json({
        success: false,
        message: "User already registered in the course",
      });
    //create order
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course_id,
        userID,
      },
    };
    const paymentRes = await instance.orders.create(options);
    return res.status(200).json({
      success: false,
      message: "Order created successfully",
      data: paymentRes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//verify signature
exports.verifySignature = async (req, res) => {
  try {
    const webhooksecret = "";
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", webhooksecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    //match the signature
    if (signature === digest) {
      const { courseId, userID } = req.body.payload.payment.entity.notes;
      //update courses
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: {
            studentsEnrolled: userID,
          },
        },
        { new: true }
      );
      //validate course
      if (!enrolledCourse)
        return res.json({
          success: false,
          message: "Course not found",
        });
      //update student
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userID },
        { $push: { courses: courseId } },
        { new: true }
      );
      //send mail
      const mailRes = await mailSender(
        "Congratulations from studynotion",
        registrationEmail,
        enrolledStudent.email
      );
      console.log("mail res", mailRes);
      return res.status(200).json({
        success: true,
        message: "Payment is authorised",
      });
    } else
      return res.json({
        success: false,
        message: "Payment is not unauthorised",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
