const Category = require("../models/Category");

//create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json({
        success: false,
        message: "Please fill all details",
      });
    const CategoryEntryInDb = await Category.create({ name, description });
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: CategoryEntryInDb,
    });
  } catch (error) {
    console.log("error while creating Category", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
  }
};

//get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const CategoriesFromDB = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.statsu(200).json({
      success: false,
      message: "Categories fetched successfully",
      data: CategoriesFromDB,
    });
  } catch (error) {
    console.log("error while fetching categories", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    if (!selectedCategory)
      return res.status(400).json({
        success: false,
        message: "No courses found",
      });
    const differentCategories=await Category.find({
      _id:{$ne:categoryId}
    }).populate("courses").exec()
    return res.status(200).json({
      success:true,
      message:"Details fetched successfully",
      data:{
        selectedCategory,
      differentCategories
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
