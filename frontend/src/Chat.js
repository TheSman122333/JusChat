import { useState, useEffect } from "react";
import Image from "./Image";
import "./Chat.css";
import ReactEmoji from "react-emoji";

function Chat({ socket, username, room }) {
  const [typedmsg, Settypedmsg] = useState("");
  const [allmsg, Setallmsg] = useState([]);
  const [file, Setfile] = useState();
  const [onlineUser, SetonlineUser] = useState([]);
  const minutes = new Date(Date.now()).getMinutes();
  const updatedmin = (minutes < 10 ? "0" : "") + minutes;

  const sendMsg = async () => {
    if (file) {
      const msgObject = {
        room: room,
        bot:"No",
        username: username,
        type: "file",
        time: new Date(Date.now()).getHours() + ":" + updatedmin,
        body: file,
        mimeType: file.type,
        fileName: file.name,
      };
      await socket.emit("send_msg", msgObject);
      Setfile();
      Setallmsg((object) => [...object, msgObject]);
    } else {
      if (typedmsg !== "") {
        const msgObject = {
          room: room,
          bot:"No",
          username: username,
          type: "text",
          msg: typedmsg,
          time: new Date(Date.now()).getHours() + ":" + updatedmin,
        };
        await socket.emit("send_msg", msgObject);
        Setallmsg((object) => [...object, msgObject]);
      }
    }

    Settypedmsg("");
  };
  const selectFile = (event) => {
    Settypedmsg(event.target.files[0].name);
    Setfile(event.target.files[0]);
  };

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      Setallmsg((object) => [...object, data]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("user_list", (users) => {
      SetonlineUser(users);
      console.log("value of users is this one", users);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("message", (message) => {
      const msgBot = {
        room: message.room,
        username: message.user,
        bot:"yes",
        type: "text",
        msg: message.text,
        time: new Date(Date.now()).getHours() + ":" + updatedmin,
      };
      Setallmsg((object) => [...object, msgBot]);
    });
  }, [socket]);

  const handleExit = () => {
    window.location.reload();
  };
  function rendermessages(message) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      const user = username === message.username ? "me" : "you";
      return (
        <div id={username === message.username ? "me" : "you"}>
          <Image
            filename={message.fileName}
            blob={blob}
            message={message}
            user={user}
          ></Image>
        </div>
      );
    } else {
      return (
        <div id={username === message.username ? "me" : ("yes" === message.bot ? "bot":"you" )}>
          <div id="msg-meta1">
            <p>{username === message.username ? "You" : message.username}</p>
            <span>{message.time}</span>
          </div>
          <div id="text-msg">{ReactEmoji.emojify(message.msg)}</div>
        </div>
      );
    }
  }
  return (
    <div className="chat-container">
      <div className="chat-header">
        <p>Room No: {room}</p>
        <p>Live Chat </p>
        <button onClick={handleExit}>Exit</button>
      </div>
      <div className="whole-chat">
        <div className="online">
          <div className = "user-header">
              Active Users {"(" + onlineUser.length + ")"}
          </div>
          <div className = "online-body">
          {onlineUser.map((user) => {
            return <div>{user.name}</div>;
          })}
          </div>
         
        </div>

        <div className="chat-content">
        <div className="chat-body">{allmsg.map(rendermessages)}</div>
          <div className="chat-footer">
            <input
              type="text"
              value={typedmsg}
              placeholder="Enter Message"
              onKeyPress={(event) => {
                event.key === "Enter" && sendMsg();
              }}
              onChange={(event) => {
                Settypedmsg(event.target.value);
              }}
            ></input>

            <label for="fileInput" className="label">
              Upload Image
            </label>
            <input type="file" id="fileInput" onChange={selectFile} />
            <button onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
