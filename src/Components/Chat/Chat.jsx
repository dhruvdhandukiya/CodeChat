import "./Chat.css"
import EmojiPicker from "emoji-picker-react";
import { onSnapshot } from "firebase/firestore";
import React, {useState, useRef, useEffect} from "react";
import { doc } from "firebase/firestore";
import { db } from "../../library/Firebase";

const Chat = () => {
    const[open, setOpen] = useState(false);
    const[text, setText] = useState("");
    const[chats, setChat] = useState();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"})
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db , "chats", "maGkgjpOfWD4SbZF6irf"), (res) =>
        {
            setChat(res.data())
        });

        return () => {
            unSub();
        }
    },[]);

    console.log(chats);

    const handleEmoji = (e) =>{
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };
    return (
        <div className="chat">
            <div className="top">
                <div className = "user">
                    <img src = "./avatar.png" alt = ""></img>
                    <div className="texts">
                        <span>Harsh D</span>
                        <p>Available</p>
                    </div>
                </div>
                <div className="icons">
                <img src = "./phone.png" alt = ""></img>
                <img src = "./video.png" alt = ""></img>
                <img src = "./info.png" alt = ""></img>
                </div>
            </div>
            <div className="center">
                <div className = "message">
                    <div className="texts">
                    <img src = "./avatar.png" alt = ""/>
                    <p>Hello, how are you.
                        my name is dhruv from SEIT
                    </p>
                    <span>1 min ago</span>
                    </div>
                </div>
                <div className = "message own">
                    <div className="texts">
                    <p>Hello, how are you.
                        my name is dhruv from SEIT
                    </p>
                    <span>1 min ago</span>
                    </div>
                </div>
                <div className = "message own">
                   <div className="texts">
                    <p>Hello, how are you.
                        my name is dhruv from SEIT
                    </p>
                    <span>1 min ago</span>
                    </div>
                </div>
                <div className = "message own">
                   <div className="texts">
                    <p>Hello, how are you.
                        my name is dhruv from SEIT
                    </p>
                    <span>1 min ago</span>
                    </div>
                </div>
                <div className = "message own">
                <div className="texts">
                    <p>Hello, how are you.
                        my name is dhruv from SEIT
                    </p>
                    <span>1 min ago</span>
                    </div>
                </div>
                <div ref = {endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src = "./img.png" alt = ""></img>
                    <img src = "./camera.png" alt = ""></img>
                    <img src = "./mic.png" alt = ""></img>
                </div>
                <input type = "text" 
                       placeholder = "Message..."
                       value = {text}
                       onChange={(e) => setText(e.target.value)}>
                </input>
                <div className = "emoji">
                <img src  =" ./emoji.png" alt = ""
                    onClick = {() => setOpen(prev => ! prev)}></img>
                <div className = "picker">
                <EmojiPicker open = {open}
                            onEmojiClick={handleEmoji}/>
                </div>
                </div>
                <button className="send">Send</button>
            </div>
        </div>
    );
}


export default Chat