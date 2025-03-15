import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-ee9c7.firebaseapp.com",
  projectId: "reactchat-ee9c7",
  storageBucket: "reactchat-ee9c7.firebasestorage.app",
  messagingSenderId: "49742442531",
  appId: "1:49742442531:web:d05454c845a16648a50196"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()