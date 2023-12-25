const { default: mongoose } = require("mongoose");

const ratingAndReviewSchema=new mongoose.Schema({
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       },
       course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
       },
       review:{
        type:String
       },
       rating:{
        type:Number
       }
})
module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema)