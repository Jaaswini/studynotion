const { default: mongoose } = require("mongoose");

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    thumbnail:{
        type:String
    },
    price:{
        type:Number
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})

module.exports=mongoose.model("Course",courseSchema)