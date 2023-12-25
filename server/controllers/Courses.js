const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

//create course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, category, price } =
      req.body;
    const thumbnail = req.files.file;
    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !thumbnail ||
      !category ||
      !price
    )
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    const userId = req.user.id;
    //validate user
    const instructorDet = await User.findById(userId);
    if (!instructorDet)
      return res.status(400).json({
        success: false,
        message: "User does not found",
      });
    //validate category
    const categoryDet = await Category.findById(category);
    if (!categoryDet)
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    //upload thumbnail to cloudinary
    const thumbnailFile = await uploadToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_FOLDERNAME
    );

    //create entry in db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      category: categoryDet._id,
      instructor: instructorDet._id,
      thumbnail: thumbnailFile.secure_url,
      price,
    });

    //update user
    await User.findByIdAndUpdate(
      { _id: instructorDet._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    //update category
    await Category.findByIdAndUpdate(
      { _id: categoryDet._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    //send res
    return res.status(200).json({
      success: true,
      message: "Course ceated successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("error while creating course", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("Instrcutor")
      .populate("Category")
      .exec();
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.log("error while fetching courses", error);
    res.status(500).json({
      success: false,
      mesage: "Internal server error",
      error: error,
    });
  }
};

//get course details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.findById({ courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "profile",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    if (!courseDetails)
      return res.status(400).json({
        success: false,
        message: "Course details not found",
      });
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
