import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/chats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats(res.data.chats);
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  const fetchAcceptedUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/request/request/accepted`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Assume res.data.requests is an array of accepted requests with sender and receiver populated
      // Get the other user from each request (not the logged-in user)
      const users = res.data.requests.map((req) =>
        req.sender._id === userId ? req.receiver : req.sender
      );
      setAcceptedUsers(users);
    } catch (error) {
      console.error("Error fetching accepted users", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchAcceptedUsers();
  }, []);

  const handleSelectUser = async (user) => {
    // Check if a chat already exists with this user
    const existingChat = chats.find(
      (chat) =>
        chat.participants.some((p) => p._id === user._id) &&
        chat.participants.some((p) => p._id === userId)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create a new chat with this user
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`,
          { participantId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChats((prev) => [...prev, res.data.chat]);
        setSelectedChat(res.data.chat);
      } catch (error) {
        console.error("Error creating chat", error);
      }
    }
  };

  return (
    <div className="flex h-[75vh] border rounded-xl overflow-hidden">
      <ChatList
        chats={chats}
        onSelectChat={setSelectedChat}
        selectedChatId={selectedChat?._id}
        acceptedUsers={acceptedUsers}
        onSelectUser={handleSelectUser}
      />
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a chat or user to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatPage;
