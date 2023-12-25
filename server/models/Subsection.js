const { default: mongoose } = require("mongoose");

const subsectionSchema =new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});
module.exports = mongoose.model("Subsection", subsectionSchema);
