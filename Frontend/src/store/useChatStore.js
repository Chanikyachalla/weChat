import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  // ===== STATE =====
  chats: [],                 // sidebar conversations
  messages: [],              // messages of selected chat
  searchedUsers: [],         // search results
  selectedChat: null,        // current chat
  isChatsLoading: false,
  isMessagesLoading: false,




  getChats: async () => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ chats: res.data });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
    } finally {
      set({ isChatsLoading: false });
    }
  },


  setSelectedChat: (chat) => {
    set({ selectedChat: chat, messages: [] });
  },


  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${chatId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },


  getSearchedUsers: async (query) => {
    try {
      if (!query.trim()) {
        set({ searchedUsers: [] });
        return;
      }

      const res = await axiosInstance.get(
        `/message/search-users?q=${encodeURIComponent(query)}`
      );

      set({ searchedUsers: res.data });
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
    }
  },


  startChat: async (user) => {
    try {
      const res = await axiosInstance.post("/message/chats", {
        userId: user._id,
      });

      set((state) => {
        const exists = state.chats.find(
          (chat) => chat._id === res.data._id
        );

        return {
          chats: exists ? state.chats : [res.data, ...state.chats],
          selectedChat: res.data,
          searchedUsers: [],
        };
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat");
    }
  },
}));
