var  socket = io();

socket.on('connect',function(){
    console.log('Connectd to server');
});

socket.on('disconnect',function(){
    console.log('Disconnectd from server');
});

socket.on('newMessage',function(email){
    console.log('New Message', email);
});
