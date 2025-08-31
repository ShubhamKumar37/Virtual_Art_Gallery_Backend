import mongoose from "mongoose";
import {sendMail} from "../helper/index.js";
import { otpTemplate } from "../helper/emailTemplates.js";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now + 10 * 60 * 1000 },
},{ timestamps: true });

otpSchema.pre("save", async function(next){
    // send mail for otp
    await sendMail(this.email, "OTP Verification", otpTemplate(this.otp));
    next();
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;