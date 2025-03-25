import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Device from "../models/device.js";

export const login = async (req, res, next) => {

    const { macAddress, deviceKey } = req.body;
    let device;
    try {
        device = await Device.findOne({ macAddress: macAddress });

        if (!device) {
            const hashedDeviceKey = bcrypt.hashSync(deviceKey);
            const newDevice = new Device({
                macAddress: macAddress,
                deviceKey: hashedDeviceKey,
                playlists: []
            });

            const session = await mongoose.startSession();
            session.startTransaction();
            await newDevice.save({session});
            session.commitTransaction();

            device = newDevice;
        } else {
            const isDeviceKeyValid = bcrypt.compareSync(deviceKey, device.deviceKey);

            if (!isDeviceKeyValid) return res.status(400).json({ message: "The device key is incorrect!!" });
        }

        return res.status(200).json({ device })
    } catch (err) {
        return res.status(400).json({ message: err });
    }
};

export const getDevice = async (req, res, next) => {

    const { macAddress, deviceKey } = req.body;

    let device;
    try {
        device = await Device.findOne({ macAddress: macAddress });

        if (!device) {
            return res.status(400).json({ message: "No device found with this MAC Address!!" });
        }

        const isDeviceKeyValid = bcrypt.compareSync(deviceKey, device.deviceKey);

        if (!isDeviceKeyValid) return res.status(400).json({ message: "Incorrect device key!!" });

        return res.status(200).json({ device })
    } catch (err) {
        return res.status(400).json({ message: err });
    }
};

export const addPlaylist = async (req, res, next) => {

    const { macAddress, deviceKey, name, host, username, password } = req.body;
    //const hashedPassword = bcrypt.hashSync(password);
    let device;

    try {
        device = await Device.findOne({ macAddress: macAddress});

        if (!device){
            return res.stautus(400).json({ message: "The device was not found!!" });
            // device = new Device();
            // device.macAddress = macAddress;
            // const hashedDeviceKey = bcrypt.hashSync(deviceKey);
            // device.deviceKey = hashedDeviceKey;
        }else{
            const isDeviceKeyValid = await bcrypt.compareSync(deviceKey, device.deviceKey);
            if(!isDeviceKeyValid) return res.status(400).json({ message: "The device key is incorrect!!" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        device.playlists.push({
            playlistName: name,
            playlistHost: host,
            playlistUsername: username,
            playlistPassword: password
        });

        await device.save({session});
        session.commitTransaction();

        return res.status(200).json({ device });
    }catch(err){
        return res.status(400).json({message: err});
    }
};

export const deletePlaylist = async (req, res, next) => {

    const { macAddress, deviceKey, name, host, username, password } = req.body;
    let device;
    try {
        device = await Device.findOne({ macAddress: macAddress});

        if (!device){
            return res.status(400).json({ message: "Something went wrong!!" });
        }else{
            const isDeviceKeyCorrect = await bcrypt.compareSync(deviceKey, device.deviceKey);
            if(!isDeviceKeyCorrect) return res.status(400).json({message: "Device Key is incorrect!!"});
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        
        let arr = device.playlists;
        let idx = -1;
        for(let i=0;i<arr.length;i++){
            if(arr[i].playlistName==name && arr[i].playlistHost==host && arr[i].playlistUsername==username && arr[i].playlistPassword==password){
                idx = i;
                break;
            }
        }
        if(idx!=-1){
            arr.splice(idx, 1);
        }
        device.playlists = arr;
        await device.save({session});
        session.commitTransaction();

        return res.status(200).json({message: "Playlist successfully deleted!!"});
    }catch(err){
        return res.status(400).json({message: err});
    }
};

export const editPlaylist = async (req, res, next) => {

    const {macAddress, deviceKey, prevName, name, host, username, password} = req.body;
    let device;
    try {
        device = await Device.findOne({ macAddress: macAddress});

        if (!device){
            return res.status(400).json({ message: "Something went wrong!!" });
        }else{
            const isDeviceKeyCorrect = await bcrypt.compareSync(deviceKey, device.deviceKey);
            if(!isDeviceKeyCorrect) return res.status(400).json({message: "Device Key is incorrect!!"});
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        
        let arr = device.playlists;
        for(let i=0;i<arr.length;i++){
            if(arr[i].playlistName==prevName){
                arr[i].playlistName = name;
                arr[i].playlistHost = host;
                arr[i].playlistUsername = username;
                arr[i].playlistPassword = password;
                break;
            }
        }
        device.playlists = arr;
        await device.save({session});
        session.commitTransaction();

        return res.status(200).json({message: "Playlist edited successfully!!"});
    }catch(err){
        return res.status(400).json({message: err});
    }
}
