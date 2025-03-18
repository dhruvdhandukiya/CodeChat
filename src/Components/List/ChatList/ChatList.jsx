import React, {useState, useEffect} from 'react';
import "./chatList.css"
import AddUser from '../../addUser/AddUser';
import { useUserStore } from "../../../library/UserStore"
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../library/Firebase';

const chatList = () => {

    const[chats, setChats] = useState([]);
    const[addMode, setAddMode] = useState(false);

    const {currentUser} = useUserStore()

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
           const items = res.data().chats;


           const promises = items.map( async(res) => {
                const userDocRef = doc(db, "users", items.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return {...items, user};
           });

           const chatData = await Promise.all(promises);

           setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt));
        })

        return () => {
            unSub()
        }
    },[currentUser.id]);

    return ( 
        <div className="chatList">
        <div className="search">
        <div className = "searchBar">
        <img src = "./search.png" alt = ""></img>
        <input type = "text" placeholder="Search"></input>
        </div>
        <img src = {addMode ? "./minus.png" : "./plus.png"} 
             alt = "" 
             className = "add"
             onClick = {() => setAddMode((prev => !prev))}></img>
        </div>
        {chats.map((chat) => (
            <div className = "item" key = {chat.chatId}>
                <img src = "./avatar.png" alt = ""/>
                <div className = "texts">
                    <span>{chat.username}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
        ))}
         {addMode && <AddUser/>}
        </div>
    );
};


export default chatList