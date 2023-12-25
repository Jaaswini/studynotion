const Subsection = require("../models/Subsection");
const Section = require("../models/Section");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
require("dotenv").config();

//create subsection
exports.createSubsection = async (req, res) => {
  try {
    //fetch data
    const { title, description, duration, sectionId } = req.body;
    const video = req.files.files;
    //validate
    if (!title || !description || !duration || !video || !sectionId)
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    //upload to cloudinary
    const videoUploadDet = await uploadToCloudinary(
      video,
      process.env.CLOUDINARY_FOLDER_NAME
    );
    //add data in db
    const newSubsection = await Subsection.create({
      title,
      duration,
      description,
      videoUrl: videoUploadDet.secure_url,
    });
    //add subsection to section
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subsection: newSubsection._id } },
      { new: true }
    );
    //send res
    return res.status(200).json({
      success: true,
      message: "Subsection created succcessfully",
      data: newSubsection,
    });
  } catch (error) {
    console.log("error while creating subsection");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//update subsection
exports.updateSubsection = async (req, res) => {
  try {
    const { sectionId, subsectionId, title, description, duration } = req.body;
    const video = req.files.file;
    if (title || description || duration || video) {
      if (!sectionId || !subsectionId)
        return res.status(400).json({
          success: false,
          message: "Please enter ids for subsection and section",
        });

      const oldSubsection = await Subsection.findById(subsectionId);
      //if vid then upload to cloudinary
      let uploadvidDet = oldSubsection.videoUrl;
      if (video)
        uploadvidDet = await uploadToCloudinary(
          video,
          process.env.CLOUDINARY_FOLDER_NAME
        );
      //update subsection
      const newSubsection = await Subsection.findByIdAndUpdate(
        { _id: subsectionId },
        {
          title: title || oldSubsection.title,
          description: description || oldSubsection.description,
          duration: duration || oldSubsection.duration,
          videoUrl: uploadvidDet,
        },
        { new: true }
      );
      //update section
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        { subsection: newSubsection._id },
        { new: true }
      );
      //send res
      return res.status(200).json({
        success: true,
        message: "Subsection updated successfully",
        data: newSubsection,
      });
    } else
      return res.status(400).json({
        success: false,
        message: "Subsection cannot be updated",
      });
  } catch (error) {
    console.log("error while updating the subsection", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//delete subsection
exports.deleteSubsection = async (req, res) => {
  try {
    const { sectionId, subsectionId } = req.body;
    if (!sectionId || !subsectionId)
      return res.status(400).json({
        success: false,
        message: "pls send section id and subsection id",
      });
      //delete from section
    //   await Section.findByIdAndDelete({_id:sectionId},{$pop:{_id:subsectionId}},{new:true});
      await Subsection.findByIdAndDelete(subsectionId)
      return res.status(200).json({
        success:true,
        message:"Subsection deleted succesfully"
      })
  } catch (error) {
    console.log("error while delteing subsection");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
