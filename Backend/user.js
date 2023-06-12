let users = [];

const addUser = (id,name,room) =>{
    // const namee = name.trim().toLowerCase();
    // const roomm = room.trim().toLowerCase();

    // const existingUser = users.find((user) => user.room === roomm && user.name===namee);
    // if(existingUser){
    //     return {error: "Username is taken"}
    // }

    const user = {id:id,name:name,room:room,};
    users.push(user);
    return user;
}

const removeUser = (id) =>{
  const index = users.findIndex((user)=> user.id===id);
  if(index !== -1){
    return users.splice(index,1)[0]
  }
}

const getUser = (id) =>{
users.find((user)=> user.id===id);
}

const getUsersInRoom = (room) => {
users.filter((user) => user.room === room)
return users;
}

module.exports = {addUser,removeUser,getUser,getUsersInRoom};