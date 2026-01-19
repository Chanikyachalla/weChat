import {create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  messages : [],
  users : [],
  selectedUser : null,
  isUsersLoading : false,
  isMessagesLoading : false,

  getUsers : async ()=> {
    set({isUsersLoading : true});
    try{
      const res = await axiosInstance.get('/message/users');
      set({users : res.data});
      console.log("Fetched users:", res.data);
    } catch (error){
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally{
      set({isUsersLoading : false});
    }
  },
    
    getMessages : async (userId) => {
        set({isMessagesLoading : true, selectedUser : userId}); 
        try{
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages : res.data});
        } catch (error){
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages. Please try again.");
        } finally{
            set({isMessagesLoading : false});
        }   
    },
    setSelectedUser : (selectedUser) => set({selectedUser})
}));