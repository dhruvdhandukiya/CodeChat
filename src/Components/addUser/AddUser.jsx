import "./AddUser.css";
import { db } from '../../library/Firebase';
import { arrayUnion, collection, query, serverTimestamp, where, doc, setDoc, updateDoc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../library/UserStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser({ id: querySnapShot.docs[0].id, ...querySnapShot.docs[0].data() });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user || !currentUser || !user.id || !currentUser.id) return;

        try {
            const chatRef = collection(db, "chats");
            const userChatsRef = collection(db, "userchats");
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
            }).catch(() => setDoc(doc(userChatsRef, user.id), { chats: [] }));

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })
            }).catch(() => setDoc(doc(userChatsRef, currentUser.id), { chats: [] }));
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;