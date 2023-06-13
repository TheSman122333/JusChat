let users = [];
const addUser = (id, name, room) => {
  const user = { id: id, name: name, room: room };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUsersInRoom };
