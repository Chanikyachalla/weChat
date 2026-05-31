import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

   
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    
    groupName: {
      type: String,
      trim: true,
    },

   
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Chat", chatSchema);
