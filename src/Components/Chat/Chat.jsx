import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, getDoc, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { db } from "../../library/Firebase";
import { useChatStore } from "../../library/ChatStore";
import { useUserStore } from "../../library/UserStore";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chats, setChat] = useState(null);

    const chatId = useChatStore((state) => state.chatId);
    const { currentUser, user } = useUserStore();
    
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    useEffect(() => {
        if (!chatId) return;

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => unSub();
    }, [chatId]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSend = async () => {
        if (text.trim() === "") return;
    
        try {
    
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser?.id,
                    text,
                    createdAt: Timestamp.now(),
                }),
            });
    
            const userIDs = [currentUser?.id, user?.id];
    
            for (const id of userIDs) {
                if (!id) continue; 
    
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);
    
                if (userChatsSnapshot.exists()) {
                    let userChatsData = userChatsSnapshot.data();
    
               
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
    
                    if (chatIndex !== -1) {
                       
                        userChatsData.chats[chatIndex] = {
                            ...userChatsData.chats[chatIndex],
                            lastMessage: text,
                            isSeen: id === currentUser?.id,
                            updatedAt: Timestamp.now(),
                        };
    
                   
                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            }
    
            setText("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>Harsh D</span>
                        <p>Available</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {(chats?.messages || []).map((message, index) => (
                    <div className="message own" key={index}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder="Message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    {open && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="send" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;