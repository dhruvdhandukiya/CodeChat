import "./AddUser.css";
import { db } from '../../library/Firebase';
import {
  arrayUnion,
  collection,
  query,
  serverTimestamp,
  where,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc
} from "firebase/firestore";
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
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser({
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        });
      } else {
        setUser(null); 
        alert("User not found.");
      }
    } catch (err) {
      console.error("Error searching user:", err);
    }
  };

  const handleAdd = async () => {
    if (!user || !currentUser || !user.id || !currentUser.id) {
      console.error("Invalid user state", { user, currentUser });
      return;
    }

    try {
      const chatRef = collection(db, "chats");
      const userChatsRef = collection(db, "userchats");
      const newChatRef = doc(chatRef); 

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const receiverDocRef = doc(userChatsRef, user.id);
      const currentUserDocRef = doc(userChatsRef, currentUser.id);

      const receiverDocSnap = await getDoc(receiverDocRef);
      const currentUserDocSnap = await getDoc(currentUserDocRef);


      if (!receiverDocSnap.exists()) {
        await setDoc(receiverDocRef, { chats: [] });
      }
      if (!currentUserDocSnap.exists()) {
        await setDoc(currentUserDocRef, { chats: [] });
      }

      const chatDataForReceiver = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: Date.now(),
      };

      const chatDataForCurrentUser = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: Date.now(),
      };

      await updateDoc(receiverDocRef, {
        chats: arrayUnion(chatDataForReceiver),
      });

      await updateDoc(currentUserDocRef, {
        chats: arrayUnion(chatDataForCurrentUser),
      });

      alert("User successfully added to chat.");
    } catch (err) {
      console.error("Error adding user:", err);
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
            <img src={user.avatar || "./avatar.png"} alt="avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
