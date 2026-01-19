import {create } from 'zustand';
import {axiosInstance} from '../lib/axios';

import { toast } from 'react-hot-toast';



export const useAuthStore = create((set) => ({
 authUser: null,
 isSigningUp: false,
 isLoggingIng: false,
 isUpsdatingProfile: false,

 isCheckingAuth: true,
 checkAuth: async ()=>{
    try{
      const res = await axiosInstance.get('/auth/check');
      set({authUser: res.data});

    }
    catch(err){
      set({authUser: null});
      console.log('Authenticated User:', null);
      console.error('Error checking auth status:', err);
    } finally{
      set({isCheckingAuth: false});
    }
 },

  signup: async (data) => { 
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      set({ authUser: response.data });
      toast.success("Signup successful!");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    } },

    logout : async () => {
      try{
        await axiosInstance.post('/auth/logout');
        set({authUser: null});
        toast.success("Logged out successfully");
      } catch (error){
        console.error('Logout error:', error);
        toast.error( error.response?.data?.message || "Logout failed. Please try again.");
      } 
    },

    login: async (data) => { 
      set({ isLoggingIng: true });  
      try {
        const response = await axiosInstance.post('/auth/login', data);
        set({ authUser: response.data });
        toast.success("Login successful!");
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      } finally {
        set({ isLoggingIng: false });
      } },

     updateProfilePic: async (file) => {
  set({ isUpsdatingProfile: true });

  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const res = await axiosInstance.post(
      "/auth/update-profile",
      formData
    );

    set({ authUser: res.data });
    toast.success("Profile picture updated successfully!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    set({ isUpsdatingProfile: false });
  }
}
}));
