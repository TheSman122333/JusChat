import { useEffect,useState } from "react";
import './Chat.css'

function Image({filename,blob,message,user}){
    const[imgSrc,setimgSrc] = useState("");

    useEffect(()=>{
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        //once reading is done set the source
        reader.onloadend = function () {
            setimgSrc(reader.result);
        }
    },[blob]);
    return(
        <>
        <div id = "msg-meta1">
        <p>{user==="me" ? "You": message.username}</p>
        <span>{message.time}</span>
        </div>
        <div className = "message-image">
 <img src = {imgSrc} alt ={filename}></img>
        </div>
        </>
       
        
    )
}

export default Image;