const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);

});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");
          
  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    //... is the the spread operator, adds to the set while retaining what was in there already
    //serviceWorkerRegistration.showNotification("${data} has just connected!");
    //alert("user joined!");
    io.emit("new user", [...activeUsers]);
     io.emit("chat message", {nick: "System", message: `${data} has just connected`});
  });
    
  socket.on("disconnect", function (data) {
      data = socket.userId;
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
       io.emit("chat message", {nick: "System", message: `${data} has just disconnected`});
    });

    socket.on("chat message", function (data) {
      io.emit("chat message", data);
  });
    
});

