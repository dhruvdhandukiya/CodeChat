import React, {useState} from 'react';
import "./chatList.css"
import AddUser from '../../addUser/AddUser';

const chatList = () => {

    const[addMode, setAddMode] = useState(false);
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
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
        <div className = "item">
            <img src = "./avatar.png" alt = ""/>
            <div className = "texts">
                <span>Harsh D</span>
                <p>Hello</p>
            </div>
        </div>
         {addMode && <AddUser/>}
        </div>
    );
};


export default chatList