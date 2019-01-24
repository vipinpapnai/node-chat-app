const path = require('path');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/user');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port  = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('join',(params,callback) => {
       if(!isRealString(params.name) || !isRealString(params.room)){
          return callback('Name and room name are required');
       }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room) .emit('newMessage',generateMessage('Admin',`${params.name} has joined`));

        callback();
    });

    socket.on('createMessage',(message,callback) => {  // listen to event createMessage emited by client
        console.log('createMessage',message);
        //broadcast the message to all connection
        io.emit('newMessage', generateMessage(message.from,message.text)) // io.emit emits the event to all connection
        callback('This is from the server');


        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude))
    });

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        }
    });
});



server.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};


