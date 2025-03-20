import Chat from "./Components/Chat/Chat"
import Detail from "./Components/Detail/Detail"
import List from "./Components/List/List"
import Login from "./Components/login/Login"
import { auth } from "./library/firebase"
import { onAuthStateChanged } from "firebase/auth"
import Notification from "./Components/notification/Notification"
import React, {useEffect} from "react"
import { useUserStore } from "./library/UserStore"
import { useChatStore } from "./library/ChatStore"


const App = () => {

  const{currentUser, isLoading, fetchUserInfo} = useUserStore();
  const{chatId} = useChatStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentUser);

  if(isLoading) return <div className="loading">Loading...</div>
  return (
    <div className='container'>
      {
        currentUser ? (
        <><List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
          </>) : (
            <Login/>
          )
      }
      <Notification/>
      </div>
  )
}

export default App