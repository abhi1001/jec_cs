var socket = io();
$(document).ready(function() {
    var user = $('#user_name').val();
    $('#newMessageForm').on('submit', function() {
        msg = "<strong>"+ user + ":</strong> " + $('#newMessage').val();
        socket.emit('message', msg);
        $('#newMessage').val('');
        return false;
    });
    socket.on('message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });
    socket.on('userconnected', function(){
        $('#messages').append($('<li>').html("<p>1 member joined</p>"));
    })
    socket.on('userdisconnected', function(){
        $('#messages').append($('<li>').html("<p>1 member left</p>"));
    })
});