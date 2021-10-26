const sio = require('socket.io')
const formatMessage = require('../../../utils/messages')
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('../../../utils/users')

const run = (server) => {
    const io = sio(server) 

    io.on('connection', (socket) => {
        console.log(`New Connection: ${socket.id}`);

        socket.on('joinRoom', ({ username }) => {
            const user = userJoin(socket.id, username); 
            io.emit('message', formatMessage('chatBot', `${user.username} has joined the chat`));
            io.emit('roomUsers', {users: getRoomUsers()})
        })

        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id)
            io.emit('message', formatMessage(user.username, msg));
        }) 

        socket.on('typing', () => {
            const user = getCurrentUser(socket.id)
            io.emit('showTyping', user.username)
        })

        socket.on('disconnect', () => {
            const user = userLeaves(socket.id)
            if(user){
                io.emit('message', formatMessage('chatBot', `${user.username} has left the chat`));
                io.emit('roomUsers', { users: getRoomUsers()
                })
            }
        })
  })
}

module.exports = run;
