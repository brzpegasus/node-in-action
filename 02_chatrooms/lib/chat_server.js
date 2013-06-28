var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
    // Start the Socket.io server, allowing it to piggyback on the existing HTTP server
    io = socketio.listen(server);
    io.set('log level', 1);

    // Define how each user connection will be handled
    io.sockets.on('connection', function(socket) {
        // Assign user a guest name when they connect
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        // Place user in Lobby room upon connection
        joinRoom(socket, 'Lobby');

        // Handle user messages, name change attempts, and room creation/changes
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // Provide user with a list of occupied rooms on request
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        // Define cleanup logic for when a user disconnects
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // Generate a new guest name and associate it with client connection ID
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;

    // Let user know their guest name
    socket.emit('nameResult', {
        success: true,
        name: name
    });

    // Guest name is now used
    namesUsed.push(name);

    return guestNumber + 1;
}

function joinRoom(socket, room) {
    // Make user join room and associate the room with client connection ID
    socket.join(room);
    currentRoom[socket.id] = room;

    // Let user know they are now in a new room
    socket.emit('joinResult', {room: room});

    // Let other users in room know that a user has joined
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    // Determine what other users are in the same room as the user
    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';

        // Send the summary of other users in the room to the user
        socket.emit('message', {text: usersInRoomSummary});
    }
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    // Listener for nameAttempt events
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            // If the name isn't already registered, register it
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;

                // Remove previous name to make available to other clients
                delete namesUsed[previousNameIndex];

                socket.emit('nameResult', {
                    success: true,
                    name: name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else {
                // Send an error to the client if the name is already registered
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}