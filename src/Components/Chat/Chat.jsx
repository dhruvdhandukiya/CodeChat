import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, getDoc, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { db } from "../../library/firebase";
import { useChatStore } from "../../library/ChatStore";
import { useUserStore } from "../../library/UserStore";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chats, setChat] = useState(null);
    const [img, setImage] = useState({
        file: null,
        url: ""
    });

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    
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

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleSend = async () => {
        if (text.trim() === "" || isCurrentUserBlocked || isReceiverBlocked) return;

        let imgUrl = null;
    
        try {
            if (img.file) {
                imgUrl = await uploadBytes(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser?.id,
                    text,
                    createdAt: Timestamp.now(),
                    ...(imgUrl && { img: imgUrl }),
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

        setImage({ file: null, url: "" });
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
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
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={index}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImage} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder={isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "You can't message this user" : "Message..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    {open && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button 
                    className="send" 
                    onClick={handleSend} 
                    disabled={isCurrentUserBlocked || isReceiverBlocked} 
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;