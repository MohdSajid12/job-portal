import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User Already Registered",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName, email, phoneNumber, password: hashedPassword, role
        });

        return res.status(201).json({
            message: "Account created Successfully",
            success: true
        })
    }
    catch (error) {
        console.log(`Error`, error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "All field is required",
                success: false
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email and Password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email and Password",
                success: false
            })
        };
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does not exists with current role",
                success: false
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            success: true
        })
    }
    catch (error) {
        console.log(`Error`, error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out Sucessfully",
            success: true
        })
    }
    catch (error) {
        console.log(`Error`, error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        if (!fullName || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const skillsArray = skills.split(",");
        const userId = req.id //middleware authentication
        const user = await User.findById(userId);
        if (!userId) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        //Updating data
        user.fullName = fullName,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.bio = bio,
            user.skills = skillsArray

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        } 

        return res.status(200).json({
            message : "Profile Updated Successfully", user,
            success :true
        })
    }
    catch (error) {
        console.log(`Error`, error);
    }
}