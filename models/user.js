import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    host: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requires: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    activeDevice: {
        macAddress: String,
        deviceKey: String
    }
});

export default mongoose.model("Users", userSchema);