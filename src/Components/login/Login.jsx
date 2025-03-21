import "./login.css"
import React, {useState} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../notification/Notification";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { doc,setDoc } from "firebase/firestore";
import { setLogLevel } from "firebase/app";

const Login = () => {

    const[avatar, setAvatar] =  useState({
        file: null,
        url: ""
    });

    const[loading, setLoading] = useState(false);

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
            setLoading(true)
            const formData = new FormData(e.target)

            const{username,email,password} = Object.fromEntries(formData);
            
            try{
                const res = await createUserWithEmailAndPassword(auth,email,password);

                await setDoc(doc(db,"users",res.user.uid), {
                    username,
                    email,
                    id: res.user.uid,
                    blocked: [],
                });

                await setDoc(doc(db,"userchats",res.user.uid), {
                    chats: [],
                });

                toast.success("Account created!! You may Login now")
            }
            catch(err){
                console.log(err);
                console.log(err.message);
            }
            finally{
                setLoading(false);
            }
        }

    const handleLogin = async(e) =>
    {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target)

        const{email,password} = Object.fromEntries(formData);

        try{
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch(err){
            console.log(err);
            console.log(err.message);
        }
        finally{
            setLoading(false);
        }
    };
    return <div className="login">
        <div className="item">
            <h2>Welcome Back</h2>
            <form onSubmit = {handleLogin}>
                <input type = "text" placeholder="Enter your Email" name = "email"></input>
                <input type = "password" placeholder="Enter your Password" name = "password"></input>
                <button disabled = {loading}>{loading ? "Loading" : "Sign In"}</button>
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
                <button disabled = {loading}>{loading ? "Loading" : "Sign In"}</button>
            </form>
        </div>
    </div>
};


export default Login