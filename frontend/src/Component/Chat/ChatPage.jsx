import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://swapskill-3546.onrender.com/api/v1/chat/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data.chats);
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen">
      <ChatList chats={chats} onSelectChat={setSelectedChat} />
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatPage;
