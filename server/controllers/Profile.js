const User = require("../models/User");
const Profile = require("../models/Profile");

//update profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      displayName = "",
      profession = "",
      dateOfBirth = "",
      gender,
      about = "",
    } = req.body;
    const id = req.user.id;
    if (!gender || !id)
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    const user = await User.findById(id);
    const profileId = user.profile;
    const profileDet = await Profile.findById(profileId);
    profileDet.displayName = displayName;
    profileDet.profession = profession;
    profileDet.dateOfBirth = dateOfBirth;
    profileDet.gender = gender;
    profileDet.about = about;
    await profileDet.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDet,
    });
  } catch (error) {
    console.log("error while updating the profile", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const userDet = await User.findById(id);
    if (!userDet)
      return res.status(400).json({
        success: false,
        message: "Id does not exists",
      });
    const profileId = userDet.profile;
    await Profile.findByIdAndDelete(profileId);
    await User.findByIdAndDelete(id);
    //uneneroll user from all course
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting profile");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//get all user details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDet = await User.findById(id).populate("profile").exec();
    if (!userDet)
      return res.status(400).json({
        success: false,
        message: "user does not exists",
      });
    return res.status(200).json({
      success: true,
      message: "USer details fetched successfully",
      data: userDet,
    });
  } catch (error) {
    console.log("error while fetching user details");
    return res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
