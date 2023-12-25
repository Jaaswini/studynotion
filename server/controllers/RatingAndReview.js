const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

//create rating
exports.createRating = async (req, res) => {
  try {
    const { courseId, review, rating } = req.body;
    const userId = req.user.id;
    const courseDet = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    //check if user enrolled in the course
    if (!courseDet)
      return res.status(400).json({
        success: true,
        message: "User not enrolled in this course",
      });
    //check if user already reviewd
    const userAlreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (userAlreadyReviewed)
      return res.status(400).json({
        success: false,
        message: "User already reviewed",
      });
    const ratingAndReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReview: ratingAndReview._id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Rating added successfully",
      data: ratingAndReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//get average rating
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    const result = await Course.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    //return res
    if (result.length > 0)
      return res.status(200).json({
        success: true,
        message: "Average rating fetched successfully",
        averageRating: result[0].averageRating,
      });
    return res.status(400).json({
      success: false,
      message: "Average rating is 0,no ratings till now",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName ",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
