const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  otp: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expireIn: 5 * 60,
  },
});

const sendVerificationMail = async (email, otp) => {
  try {
    const mailResposne = await mailSender(
      "Verification Email from StudyNotion",
      otp,
      email
    );
    console.log("mail response for verification mail", mailResposne);
  } catch (error) {
    console.log("error while sending verification mail", error);
  }
};

otpSchema.pre("save", async function (next) {
  try {
    await sendVerificationMail(this.email, this.otp);
    next();
  } catch (error) {
    console.log("error while sending otp", error);
  }
});
module.exports = mongoose.model("Otp", otpSchema);
