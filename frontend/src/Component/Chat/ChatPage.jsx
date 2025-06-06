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
      `https://swapskill-3546.onrender.com/api/v1/request/accepted`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const loggedInUserId = localStorage.getItem("userId"); // current user ID

    const users = res.data.requests.map((req) => {
      // return the other user's ID
      return req.senderId === loggedInUserId ? req.receiverId : req.senderId;
    });
console.log(users)
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
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/chat`,
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
