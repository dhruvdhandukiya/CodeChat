import { auth } from "../../library/firebase";
import "./Detail.css";
import { useChatStore } from "../../library/ChatStore";
import { arrayRemove, arrayUnion, updateDoc, doc } from "firebase/firestore";
import { db } from "../../library/firebase";
import { useUserStore } from "../../library/UserStore";


const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore(); 

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt=""></img>
                <h2>{user?.username || "Loading..."}</h2>
                <p>Aur bhai kaisa hai</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://www.pexels.com/search/beautiful/" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://www.pexels.com/search/beautiful/" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="info">
                    <button onClick={handleBlock}>
                        {isCurrentUserBlocked ? "You Are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"}
                    </button>
                    <button className="logout" onClick={() => auth.signOut()}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
