const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().charAt(0).toUpperCase()+room.slice(1).toLowerCase()

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) {
    return { err: "Username taken" };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
