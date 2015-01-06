(function () {
  if (typeof myChatServer === "undefined"){
    myChatServer = {};
  }

  myChatServer.Chat = function (socket) {
    this.socket = socket;

    socket.on("message", function (data) {
      console.log(arguments);
      myChatServer.ChatUI.addToPage(data.message);
    })
  };

  myChatServer.Chat.prototype.sendMessage = function (message){
    this.socket.emit('message', {message: message});
  };

  myChatServer.Chat.prototype.processCommand = function (message){
    if (message.indexOf("nick") === 0) {
      this.socket.emit("nicknameChangeRequest", {message: message});
    } else if (message.indexOf("join") === 0){
      this.socket.emit("roomChangeRequest", {message: message});
    }
  }
})();
