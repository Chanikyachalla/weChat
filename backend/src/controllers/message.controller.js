import express from "express";
import User from "../models/user.model.js";
import Message from "../models/message.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('fullName email profilePic');
        res.status(200).json(filteredUsers);

    }
    catch(error){
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getmessages = async (req, res) => {
    try {
           const {id:receiverId} = req.params;
           const senderId = req.user._id; 
           const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
           }).sort({createdAt:1});
           res.status(200).json(messages);
    }
    
    catch (error){
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        let imageUrl;
        if(image ){
            const uploadResponse = await cloudinary.uploader.upload(image);
            
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId, 
            text,
            image : imageUrl
        });
        await newMessage.save();
        //todo realtime function goes here using the socket.io
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}