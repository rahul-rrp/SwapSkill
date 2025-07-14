import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL); // Setup socket connection

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.emit("join_chat", chat._id);
  }, [chat]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chat._id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const payload = { chatId: chat._id, text };

    try {
      // 1. Save message to DB
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/chat/message`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Emit real-time message
      const message = {
        senderId: { _id: userId }, // for rendering
        text,
        timestamp: new Date(),
      };

      socket.emit("send_message", {
        chatId: chat._id,
        message,
      });

      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Listen to real-time incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receive_message");
  }, [chat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-white" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-xs w-fit ${
              msg.senderId?._id?.toString() === userId
                ? "bg-blue-100 self-end"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex border-t p-4">
        <input
          className="flex-1 border px-3 py-2 rounded-l"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
          onClick={sendMessage}
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
