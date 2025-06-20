import "./login.css";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useUserStore } from "../../library/UserStore";
import { useChatStore } from "../../library/ChatStore";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const { fetchUserInfo } = useUserStore();

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // Register user via Firebase Auth
      const res = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      const userId = res.user.uid;

      // Set user document after authentication
      await setDoc(doc(db, "users", userId), {
        username,
        email,
        id: userId,
        avatar: avatar.url || "./avatar.png",
        blocked: [],
      });

      // Initialize user's chat list
      await setDoc(doc(db, "userchats", userId), {
        chats: [],
      });

      toast.success("Account created! You may now log in.");
    } catch (err) {
      console.error("Registration Error:", err.message);
      toast.error("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      const user = userCredential.user;

      await fetchUserInfo(user.uid);

      const { setChatId, setUser } = useChatStore.getState();

      const defaultChatId = "chat_abc123"; // For testing/demo purpose
      const receiverUserId = "user2";      // Make sure this user exists in Firestore

      const receiverDoc = await getDoc(doc(db, "users", receiverUserId));
      if (receiverDoc.exists()) {
        const receiver = receiverDoc.data();

        setChatId(defaultChatId);
        setUser({
          id: receiverUserId,
          username: receiver.username,
          avatar: receiver.avatar || "./avatar.png",
        });

        toast.success("Login successful! Chat opened.");
      } else {
        toast.warning("Login successful, but receiver user not found.");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      toast.error("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your Email"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            name="password"
            required
          />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="Avatar" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
            accept="image/*"
          />
          <input
            type="text"
            placeholder="Enter your Username"
            name="username"
            required
          />
          <input
            type="text"
            placeholder="Enter your Email"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            name="password"
            required
          />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
