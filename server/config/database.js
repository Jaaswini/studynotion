const { default: mongoose } = require("mongoose")
require("dotenv").config()
const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("db connected successfully")
    }).catch((error)=>{
        console.log("error while connected database",error);
        process.exit(1)
    })
}
module.exports=dbConnect;