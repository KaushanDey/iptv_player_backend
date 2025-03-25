import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true
    },
    deviceKey: {
        type: String,
        required: true,
        unique: true
    },
    playlists: [{
        playlistName:{
            type: String,
            unique: true
            
        },
        playlistHost: String,
        playlistUsername: String,
        playlistPassword: String
    }]
});

export default mongoose.model("Devices", deviceSchema);