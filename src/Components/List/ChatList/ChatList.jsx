import React, { useState, useEffect } from "react";
import "./chatList.css";
import AddUser from "../../addUser/AddUser";
import { useUserStore } from "../../../library/UserStore";
import { doc, getDoc, onSnapshot , updateDoc} from "firebase/firestore";
import { db } from "../../../library/firebase";
import { useChatStore } from "../../../library/ChatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data()?.chats || [];

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user };
      });

      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const handleSelect = async (chat) => {
    if (!chat?.chatId || !chat?.user) {
        console.error("Invalid chat data:", chat);
        return;
    }

    if (!chat.user || typeof chat.user !== "object") {
        console.error("User data is missing or invalid:", chat);
        return;
    }
    const userChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest;
    });

    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);

    if (chatIndex === -1) {
        console.warn("Chat not found in userChats:", chat.chatId);
        return;
    }

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
        await updateDoc(userChatsRef, {
            chats: userChats,
        });

        changeChat(chat.chatId, chat.user);
    } catch (err) {
        console.error("Error updating chat:", err);
    }
};


  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {chats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ 
            cursor: "pointer", 
            backgroundColor: chat?.isSeen === false ? "blue" : "transparent" 
        }}
        >
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
