const { default: mongoose } = require("mongoose");

const sectionSchema=new mongoose.Schema({
    sectionName:{
        type:String,
        required:true
    },
    subsection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection"
    }]
})
module.exports=mongoose.model("Section",sectionSchema)