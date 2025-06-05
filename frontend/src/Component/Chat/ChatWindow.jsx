import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/chat/chat/${chat._id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        "http://localhost:4000/api/v1/chat/chat/message",
        { chatId: chat._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chat]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-xs w-fit ${
              msg.senderId?._id === userId ? "bg-blue-100 self-end" : "bg-gray-200"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
