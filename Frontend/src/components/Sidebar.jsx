import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const Sidebar = () => {
  const { authUser } = useAuthStore();

  const {
    chats,
    searchedUsers,
    selectedChat,
    getChats,
    getSearchedUsers,
    setSelectedChat,
    isChatsLoading,
  } = useChatStore();

  const [query, setQuery] = useState("");

  // Fetch conversations (NOT users)
  useEffect(() => {
    getChats();
  }, [getChats]);

  // Debounced search (for new users only)
  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(() => {
      getSearchedUsers(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, getSearchedUsers]);

  if (isChatsLoading) {
    return <SidebarSkeleton />;
  }



  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <span className="font-medium hidden lg:block">
            Chats
          </span>
        </div>

        {/* Search (start new chat) */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-base-200 outline-none focus:ring-1 focus:ring-base-300"
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 w-full py-3">
        {/* SEARCH RESULTS (new users) */}
        {query.trim() &&
          searchedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedChat(user);
                setQuery("");
              }}
              className="w-full p-3 flex items-center gap-3 hover:bg-base-300"
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 rounded-full object-cover"
              />

              <div className="hidden lg:block text-left">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  Start new chat
                </div>
              </div>
            </button>
          ))}

        {/* USER LIST */}
        {!query.trim() &&
          chats.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedChat(user)}
                className={`
                  w-full p-3 flex items-center gap-3 hover:bg-base-300
                  ${
                    selectedChat?._id === user._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }
                `}
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 rounded-full object-cover"
                />

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">
                    {user.fullName}
                  </div>
                </div>
              </button>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
