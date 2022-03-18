// Node server which will handle socket.io connections
const app = require('express')(); 
const http = require('http').createServer(app);

const cors = require('cors');
app.use(cors());

const io = require('socket.io')(http, {
    cors:{
        origin : '*',
    }
});

const users = {};

io.on('connection', socket => {
    // If someones joins the chat, let others connected to the server know
    socket.on('new-user-joined', name => {
        // console.log('New user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    // If someones sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });
    
    // If someones leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

http.listen(8000);

