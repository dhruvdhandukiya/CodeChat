import "./login.css"
import React, {useState} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Notification from "../notification/Notification";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../library/Firebase";

const Login = () => {

    const[avatar, setAvatar] =  useState({
        file: null,
        url: ""
    })

    const handleAvatar = e => {
        if(e.target.files[0]){
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }
    }
    const handleRegister = async(e) =>
        {
            e.preventDefault()
            const formData = new FormData(e.target)

            const{username,email,password} = Object.fromEntries(formData);
            
            try{
                const res = await createUserWithEmailAndPassword(auth,email,password);
            }
            catch(err){
                console.log(err);
                console.log(err.message);
            }
        }

    const handleLogin = e =>
    {
        e.preventDefault()
    }
    return <div className="login">
        <div className="item">
            <h2>Welcome Back</h2>
            <form onSubmit = {handleLogin}>
                <input type = "text" placeholder="Enter your Email" name = "email"></input>
                <input type = "password" placeholder="Enter your Password" name = "password"></input>
                <button>Sign In</button>
            </form>
        </div>
        <div className="separator"></div>
        <div className="item">
        <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor = "file">
                    <img src = {avatar.url || "./avatar.png"} alt = ""></img>
                    Upload an image</label>
                <input type = "file" id = "file" style = {{display : "none"}} onChange={handleAvatar}></input>
                <input type = "text" placeholder="Enter your Username" name = "username"></input>
                <input type = "text" placeholder="Enter your Email" name = "email"></input>
                <input type = "password" placeholder="Enter your Password" name = "password"></input>
                <button>Sign In</button>
            </form>
        </div>
    </div>
};


export default Login