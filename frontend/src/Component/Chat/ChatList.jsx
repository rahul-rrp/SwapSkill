import React from "react";

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <aside className="w-1/3 border-r overflow-y-auto bg-gray-50 p-4">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      <ul>
        {chats.map((chat) => {
          const otherUser = chat.participants.find((p) => p._id !== localStorage.getItem("userId")); // if stored
          return (
            <li
              key={chat._id}
              className="p-3 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => onSelectChat(chat)}
            >
              {otherUser?.firstName} {otherUser?.lastName}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ChatList;
