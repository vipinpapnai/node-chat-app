const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port  = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.on('disconnect',(socket)=>{
        console.log('User Disconnected');
    });

});



server.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};


