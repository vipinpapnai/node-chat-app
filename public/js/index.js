var  socket = io();

socket.on('connect',function(){
    console.log('Connectd to server');
});

socket.on('disconnect',function(){
    console.log('Disconnectd from server');
});

socket.on('newMessage',function(message){
    console.log('New Message', message);

    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//     from: 'Vipin',
//     text: 'Hello'
// },function(data){
//     console.log('got it', data);
// });

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    // alert($('[name=message]').val());
    socket.emit('createMessage',{
        from: 'Vipin',
        text: jQuery('[name=message]').val()
    },function(){

    })
});