(function () {
  if (typeof myChatServer === "undefined"){
    myChatServer = {};
  }

  ChatUI = myChatServer.ChatUI = {};

  var socket = io();
  var chat = ChatUI.chat = new myChatServer.Chat(socket);

  ChatUI.getMessage = function($form) {
    return $form.find("input").val();
  };

  ChatUI.sendMessage = function(message){
    chat.sendMessage(message);
  };

  ChatUI.addToPage = function(message, className){
    var li = $("<li>");
    li.text(message).addClass(className);

    $(".messages").prepend(li);
  };


  $(function () {
    $(".current-room").html("You are currently in " + chat.room + '.');
    chat.socket.on('roomList', function (){
      $(".current-room").html("You are currently in " + chat.room);
    })

    $(".send-message").on("submit", function (e) {
      e.preventDefault();
      message = ChatUI.getMessage($(e.currentTarget));
      if (message[0] === "/") {
        chat.processCommand(message.slice(1));
      } else {
        ChatUI.sendMessage(message);
      }
      $(this).find("input").val("");

    });

    socket.on("nicknameChangeResult", function (e) {
      var className;

      if (e.success === false){
        className = "error";
      } else if (e.success === true) {
        className = "success"
      }
      ChatUI.addToPage(e.message, className)
     })


  });
})();
