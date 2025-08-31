import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    template: {type : Number, required: true},
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now + 10 * 60 * 1000 },
},{ timestamps: true });

otpSchema.pre("save", async function(next){
    // send mail for otp
    next();
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;