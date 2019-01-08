var  socket = io();

var scrollToBottom = function(){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight =  messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        console.log('scroll')
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect',function(){
    console.log('Connectd to server');
});

socket.on('disconnect',function(){
    console.log('Disconnectd from server');
});

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        createdAt:formattedTime,
        text: message.text
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        createdAt:formattedTime,
        url: message.url
    });
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank" > : My Current Location</a>');
    //
    // li.text(`${message.from} ${formattedTime}`);
    // a.attr('href',message.url);
    // li.append(a);
    jQuery('#messages').append(html);
    scrollToBottom();
});
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from: 'Vipin',
        text: messageTextBox.val()
    },function(){
        messageTextBox.val('');
    })
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(e){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');;
       socket.emit('createLocationMessage',{
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
    },function(){
        alert('Unable to fetch location');
    })
});

