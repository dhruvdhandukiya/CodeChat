import "./userInfo.css"

const userInfo = () => {
    return (
        <div className="userInfo">
            <div className = "user">
                <img src = "./avatar.png" alt = ""></img>
                <h2>Dhruv Dhandukiya</h2>
            </div>
        <div className = "icons">
        <img src = "./more.png" alt = ""></img>
        <img src = "./video.png" alt = ""></img>
        <img src = "./edit.png" alt = ""></img>
        </div>
        </div>
    );
}


export default userInfo