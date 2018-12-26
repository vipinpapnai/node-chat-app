const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

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

    // socket.emit('newMessage',{   // socket.emit emits the event to single connection
    //     from : 'vipin',
    //     text : 'Hey, Whats up.',
    //     createdAt: 123456
    // });

    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','A new User Joined'));

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

});



server.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};


