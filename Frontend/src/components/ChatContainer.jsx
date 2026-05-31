import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, Image, X } from "lucide-react";

const ChatContainer = () => {
  const {
    selectedChat,
    messages,
    getMessages,
    isMessagesLoading,
    sendMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedChat?._id) {
      getMessages(selectedChat._id);
    }
  }, [selectedChat?._id, getMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Loading skeleton ──
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="skeleton size-10 rounded-full" />
            <div>
              <div className="skeleton h-4 w-32 mb-1" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="skeleton h-16 w-48 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* ── Chat Header ── */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat?.profilePic || "/avatar.png"}
            alt={selectedChat?.fullName}
            className="size-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium">{selectedChat?.fullName}</h3>
            <p className="text-sm text-base-content/70">Offline</p>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedChat?.profilePic || "/avatar.png"
                  }
                  alt="avatar"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* ── Message Input ── */}
      <div className="p-4 border-t border-base-300">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                  flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className={`hidden sm:flex btn btn-circle
                ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
