import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User, Search } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    getSearchedUsers,
    users,
    searchedUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Handle search input
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeout = setTimeout(() => {
      getSearchedUsers(query);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query, getSearchedUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  const displayUsers = query.trim() ? searchedUsers : users;

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

        {/* Search bar (desktop only) */}
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

      {/* Users list */}
      <div className="overflow-y-auto flex-1 w-full py-3">
        {displayUsers.length === 0 && query.trim() && (
          <p className="text-center text-sm text-zinc-400">
            No users found
          </p>
        )}

        {displayUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setQuery(""); // reset search after selection
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
            </div>

            {/* User info */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.fullName}
              </div>
              <div className="text-sm text-zinc-400">
                {/* Socket-based online status later */}
                Offline
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
