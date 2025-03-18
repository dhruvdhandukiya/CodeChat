import { auth } from "../../library/Firebase";
import "./Detail.css"


const Detail = () => {
    return (
        <div className="detail">
            <div className = "user">
                <img src = "./avatar.png" alt = ""></img>
                <h2>Harsh D</h2>
                <p>Aur bhai kaisa hai</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src = "./arrowUp.png" alt = ""/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src = "./arrowUp.png" alt = ""/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src = "./arrowDown.png" alt = ""/>
                    </div>
                    <div className = "photos">
                    <div className="photoItem">
                            <div className="photoDetail">
                            <img src ="https://www.pexels.com/search/beautiful/"/>
                            <span>photo_2024_2.png</span>
                        </div>
                        <img src = "./download.png" alt = "" className = "icon"/>
                    </div>
                    <div className="photoItem">
                            <div className="photoDetail">
                            <img src ="https://www.pexels.com/search/beautiful/"/>
                            <span>photo_2024_2.png</span>
                        </div>
                        <img src = "./download.png" alt = "" className = "icon"/>
                    </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src = "./arrowUp.png" alt = ""/>
                    </div>
                </div>
                <div className="info">
                <button>Block user</button>
                <button className = "logout" onClick = {() => auth.signOut()}>Logout</button>
                </div>
            </div>
        </div>
    );
}


export default Detail