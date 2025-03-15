import Chat from "./Components/Chat/Chat"
import Detail from "./Components/Detail/Detail"
import List from "./Components/List/List"
import Login from "./Components/login/Login"
import Notification from "./Components/notification/Notification"

const App = () => {

  const user = false;
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