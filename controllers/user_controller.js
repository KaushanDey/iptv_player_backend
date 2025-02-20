import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const addUser = async (req, res, next) => {

    const { host, username, password } = req.body;

    let user;
    try {
        user = await User.findOne({ host: host, username: username });
        if (user) {
            let isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "The password is incorrect!!" });
            }
            return res.status(200).json({ message: "User already exists!!" });
        }
        if (!user) {
            let hashedPassword = bcrypt.hashSync(password);
            user = new User({
                host: host,
                username: username,
                password: hashedPassword,
                isActive: false
            });
            await user.save();
        }
        return res.status(200).json({ message: "User added successfully!!" });
    } catch (err) {
        return res.status(400).json({ message: err });
    }
};

export const getUser = async (req, res, next) => {

    const { host, username, password } = req.body;

    let user;
    try {
        user = await User.findOne({ host: host, username: username });

        if (!user) {
            return res.status(400).json({ message: "User not registered in the website!!" });
        }

        let isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "The password is incorrect!!" });
        }
        
        return res.status(200).json({ user });
    } catch (err) {
        return req.status(400).json({ message: err });
    }
};