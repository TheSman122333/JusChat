import {useState} from 'react';
import Chat from './Chat';
import io from 'socket.io-client'  // Used to connect frontend with backend.

const socket = io.connect("http://localhost:3001");  // connecting with server;
function App() {
  const [username,Setusername]= useState("");
  const [room, Setroom] = useState("");
  const [dischat,Setdischat] = useState(false);
  const [onusers,Setonusers] = useState([]);
  const joinRoom = () =>{
    if (username !== ""  && room !== ""){
      socket.emit("join_room",room);
      Setdischat(true);
    }
  }

  return (
    <div className="App">
      {!dischat ? (<div className="join-chat-container">
      <h3>Join chat</h3>
      <input type = "text" 
       placeholder = "Your Name" 
       onChange = {(event) => {
        Setusername(event.target.value)
        }}></input>

      <input type = "text" 
      placeholder = "Room No"
      onChange = {(event) =>{
        Setroom(event.target.value);
      }}
      onKeyPress ={(event) =>{
        event.key === "Enter" && joinRoom()
     }}></input>

      <button onClick={joinRoom}>Lessgo</button>
      </div>) : ( <Chat socket = {socket} username = {username} room = {room} onusers = {onusers}/>)}
     
    </div>
      
  );
}

export default App;
