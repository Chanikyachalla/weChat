import {create } from 'zustand';
import {axiosInstance} from '../lib/axios';

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

  signup: async (formData) => { 
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      set({ authUser: response.data });
      toast.success("Signup successful!");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    } },

}));