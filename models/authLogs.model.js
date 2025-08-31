import mongoose from "mongoose";

const authLogsSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    ip: {type: String, default: null},
    device: {type: String, default: null},
    browser: {type: String, default: null},
    email: {type: String, default: null},
    reason: {type: String, default: null},
},{ timestamps: true });

const AuthLogs = mongoose.model("AuthLogs", authLogsSchema);

export default AuthLogs;