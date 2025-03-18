import Chat from "./Components/Chat/Chat"
import Detail from "./Components/Detail/Detail"
import List from "./Components/List/List"
import Login from "./Components/login/Login"
import { auth } from "./library/Firebase"
import { onAuthStateChanged } from "firebase/auth"
import Notification from "./Components/notification/Notification"
import React, {useEffect} from "react"

const App = () => {

  const user = false;

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user)
    });

    return () => {
      unSub();
    };
  }, [])
  return (
    <div className='container'>
      {
        user ? (
        <><List/>
          <Chat/>
          <Detail/>
          </>) : (
            <Login/>
          )
      }
      <Notification/>
      </div>
  )
}

export default App