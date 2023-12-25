const { default: mongoose } = require("mongoose");

const userSchema =new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  token:{
    type:String
  },
  passwordExpiresIn:{
    type:Date
  },
  accountType: {
    type: String,
    enum: ["Student", "Instructor", "Admin"],
    required: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  coursesProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
