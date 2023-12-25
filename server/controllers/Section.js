const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validate
    if (!sectionName || !courseId)
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    const newSection = await Section.create({ sectionName });
    await Course.findByIdAndUpdate(
      { _id: newSection._id },
      { $push: { courseContent: newSection._id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.log("error while creating section", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //fetch
    const { sectionName, sectionId } = req.body;
    //validate
    if (!sectionName || !sectionId)
      return res.status(400).json({
        success: false,
        message: "Fill all the deta ils",
      });
    //update
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    return res.staus(200).json({
      success: true,
      message: "Section updated succcessfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("erro while updating section");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //fetch
    const { sectionId, courseId } = req.body;
    //validate
    if (!sectionId || !courseId)
      return res.status(400).json({
        success: false,
        message: "fill all the details",
      });
      //delete section
      await Section.findByIdAndDelete(sectionId);
      //delete section from course
    //   await Course.find

      //return res
      return res.status(200).json({
        success:true,
        message:"Section deleted succes sfully"
      })
  } catch (error) {
    console.log("error while deleting section", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
