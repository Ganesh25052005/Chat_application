import { json } from "express";
import User from "../models/user.model.js"
import { generate_token } from "../lib/util.js"

import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const {fullname,password,email} = req.body;
    try {

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const user = await User.findOne ({email:email});
        if(user) return res.status(400).json({message: "Email already in use"});
        
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser =  await User.create(
            {
                fullname:fullname,
                email:email,
                password:hashedPassword,
            }
        )

        if(newUser){
            generate_token(newUser._id,res);
            await newUser.save();
            res.status(201).json(
                newUser
            );
        }
        else{
            return res.status(400).json({message:"user data invalid"});
        }

        
    } catch (error) {
        console.log(error);
    }

};

export const login = async (req,res)=>{
    const {email , password } = req.body;
    try {   
        if(!email || !password){
            return req.status(400).json({message:"All fields are required"});
        }

        if(password.length<6){
            return req.status(400).json({message:"Password must be at least 6 characters"});
        }

        const user = await User.findOne({email:email});

        if(!user) return res.status(400).json({message:"Wrong credentials"});

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        
        if(!isPasswordCorrect)res.status(400).json({message:"Wrong credentials"});
       
        
        generate_token(user._id,res);
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
    }

};

export const logout = (req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});

    } catch (error) {
        
    }
};

export const updateProfile = async (req,res)=>{
    try {
        
        const {profilePic} = req.body;
        const userID = req.user._id ;

        if(!profilePic) return res.status(400).json({message:"Profile Pic is required"});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findOneAndUpdate(userID,{profilePic:uploadResponse.secure_url},{new:true});

        res.status(200).json(updatedUser);

    } catch (error) {
        
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
    }
}