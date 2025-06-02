import {json} from 'express';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId,io } from '../lib/socket.js';


export const getUsersForSideBar = async (req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedInUser}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
    }
};

export const getMessages = async (req,res)=>{
    try {
        const {id:UserToChatId} = req.params;
        const SenderId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:SenderId , recieverId:UserToChatId},
                {senderId:UserToChatId,recieverId:SenderId}
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
    }
};

export const SendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:RecieverId} = req.params;
        const SenderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            recieverId:RecieverId,
            senderId:SenderId,
            text:text,
            image:imageUrl,
        });

        const recieverSocketId = getReceiverSocketId(RecieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
    }
} 