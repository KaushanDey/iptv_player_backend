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

            await newDevice.save();

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
    const hashedPassword = bcrypt.hashSync(password);
    let device;

    try {
        device = await Device.findOne({ macAddress: macAddress, deviceKey: deviceKey });

        if (!device) return res.stautus(400).json({ message: "Something went wrong!!" });

        const session = await mongoose.startSession();
        session.startTransaction();
        device.playlists.push({
            name,
            host,
            username,
            hashedPassword
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
    const hashedPassword = bcrypt.hashSync(password);
    let device;

    try {
        device = await Device.findOne({ macAddress: macAddress, deviceKey: deviceKey });

        if (!device) return res.stautus(400).json({ message: "Something went wrong!!" });

        const session = await mongoose.startSession();
        session.startTransaction();
        
        let arr = device.playlists;
        let idx = -1;
        for(let i=0;i<arr.length;i++){
            if(arr[i].name==name && arr[i].host==host && arr[i].username==username && arr[i].password==password){
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

