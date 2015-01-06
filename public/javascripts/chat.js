(function () {
  if (typeof myChatServer === "undefined"){
    myChatServer = {};
  }

  myChatServer.Chat = function (socket) {
    this.socket = socket;
    this.room = "lobby";

    socket.on("message", function (data) {
      myChatServer.ChatUI.addToPage(data.message);
    })
  };

  myChatServer.Chat.prototype.sendMessage = function (message){
    this.socket.emit('message', {
      message: message,
      room: this.room});
  };

  myChatServer.Chat.prototype.joinRoom = function (newRoom) {
    this.room = newRoom;
    this.socket.emit("roomChangeRequest", newRoom);
  }

  myChatServer.Chat.prototype.processCommand = function (command){
    var commandArgs = command.split(' ');

    switch (commandArgs[0]) {
    case 'nick':
      var newName = commandArgs[1];
      this.socket.emit('nicknameChangeRequest', newName);
      break;
    case 'join':
      var newRoom = commandArgs[1];
      this.joinRoom(newRoom);
      break;
    default:
      this.socket.emit('message', {
        text: "unrecognized command"
      });
      break;
    }
  }
    // if (message.indexOf("nick") === 0) {
    //   this.socket.emit("nicknameChangeRequest", {message: message});
    // } else if (message.indexOf("join") === 0){
    //   this.socket.emit("roomChangeRequest", {message: message});
    // }
})();
