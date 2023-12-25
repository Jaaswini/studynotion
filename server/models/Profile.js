const { default: mongoose } = require("mongoose");

const profileSchema =new mongoose.Schema({
  displayName: {
    type: String,
  },
  profession: {
    type: String,
    enum: ["Student", "Developer"],
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  about: {
    type: String,
  },
});
module.exports = mongoose.model("Profile", profileSchema);
