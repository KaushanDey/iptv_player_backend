import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true
    },
    deviceKey: {
        type: String,
        required: true
    },
    playlists: [{
        playlistName: String,
        playlistHost: String,
        playlistUsername: String,
        playlistPassword: String
    }]
});

export default mongoose.model("Devices", deviceSchema);