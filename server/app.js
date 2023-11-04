const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server); // Attach socket.io to the server

const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Store user names
const users = {};

io.on('connection', socket => {
    // Prompt the user for their name
    socket.emit('request-name');

    // When a user sends their name, store it and notify others
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message, name: users[socket.id] });
    });

    // If someone leaves the chat, let others know
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


    socket.on('drawing', data => {
        socket.broadcast.emit('drawing', data);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
