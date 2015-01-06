var socketio = require('socket.io');
var guestnumber = 0;
var nicknames = {};
var currentRooms = {};

var createChat = function (server) {
  var io = socketio.listen(server);

  io.sockets.on('connection', function (socket) {
    guestnumber += 1;
    nicknames[socket.id] = "guest" + guestnumber;
    joinRoom(socket, "lobby");
    handleMessage(socket, io);
    handleRoomChangeRequests(socket, io);

  });
};

var handleMessage = function (socket, io){
  socket.on('message', function (data) {
    io.to(currentRooms[socket.id]).emit("message", {
      message: (nicknames[socket.id] + " says: " + data.message)
    });
  });
  socket.on('nicknameChangeRequest', function (data) {
    handleNicknameRequest(socket, io, data)
  });
};

var handleNicknameRequest = function (socket, io, newName) {

  if (newName.indexOf("guest") === 0){
    socket.emit('nicknameChangeResult', {
      success: false,
      message: 'Names cannot begin with "guest".'
    });
  } else {
    for (var id in nicknames) {
      if (nicknames[id] === newName) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Name is already taken.'
        });
        return;
      }
    };

    io.emit("nicknameChangeResult", {
      success: true,
      message: (nicknames[socket.id] + " changed their name to " + newName)
    });
    nicknames[socket.id] = newName;
  };
};

var joinRoom = function (socket, room) {
  socket.join(room);
  currentRooms[socket.id] = room;
  console.log(currentRooms);
};

var handleRoomChangeRequests = function (socket, io) {
  socket.on('roomChangeRequest', function (data) {
    socket.leave(currentRooms[socket.id]);
    joinRoom(socket, data);
    io.sockets.emit('roomList');
  })
}

module.exports = createChat;
