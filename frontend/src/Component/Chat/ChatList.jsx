import React from "react";

const ChatList = ({
  chats,
  onSelectChat,
  selectedChatId,
  acceptedUsers,
  onSelectUser,
}) => {
  const userId = localStorage.getItem("userId");

  return (
    <aside className="w-1/3 border-r overflow-y-auto bg-gray-50 p-4">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      <ul>
        {chats.map((chat) => {
          const otherUser = chat.participants?.find(
            (p) => p._id?.toString() !== userId
          );

          return (
            <li
              key={chat._id}
              className={`p-3 rounded cursor-pointer ${
                chat._id === selectedChatId ? "bg-blue-200" : "hover:bg-gray-200"
              }`}
              onClick={() => onSelectChat(chat)}
            >
              {otherUser
                ? `${otherUser.firstName} ${otherUser.lastName}`
                : "No Participant"}
            </li>
          );
        })}
      </ul>

      <hr className="my-4" />

      <h2 className="text-xl font-bold mb-4">Accepted Users</h2>
      <ul>
        {acceptedUsers && acceptedUsers.length > 0 ? (
          acceptedUsers.map((user) => (
            <li
              key={user._id}
              className="p-3 rounded cursor-pointer hover:bg-green-200"
              onClick={() => onSelectUser(user)}
            >
              {user.firstName} {user.lastName}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No accepted users found</li>
        )}
      </ul>
    </aside>
  );
};

export default ChatList;
