// const User = require('./../models/uerModel');
import User from '../models/userModel.js';
import { generateNewToken } from '../utils/refreshToken.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    console.log(password, findUser);
    if (findUser && (await bcrypt.compare(password, findUser?.password))) {
        const refreshToken = await generateNewToken(findUser?._id);
        // const updateuser = await User.findByIdAndUpdate(
        // findUser._id,
        // {
        //     refreshToken: refreshToken,
        // },
        // { new: true }
        // );


        // res.cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        // maxAge: 72 * 60 * 60 * 1000,
        // });

        console.log('heloooo');

        res.status(200).json({
            _id: findUser?._id,
            name: findUser?.name,
            email: findUser?.email,
            token: refreshToken,
            });
         
    } else {
        throw new Error("Invalid Credentials");
    }

    } catch(error) {
        res.status(500).json({ message: error.message, sucess: false },);
    }
}

export const signUp = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user, 'user1233333333333')

    if (!user) {
        try {
            // create user 
            const newUser = await new User(req.body);
            newUser.save();
            res.status(200).json(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message, sucess: false },);
        }
    } else {
        // user Already exists
        throw new Error("user Already exists");
    }
}
export const logout = (req, res) => {
    try {

    } catch(error) {
        
    }
}
export const forgotPasswordToken = (req, res) => {
    try {

    } catch(error) {
        
    }
}
export const resetPassword = (req, res) => {
    try {

    } catch(error) {
        
    }
}

