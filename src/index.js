const path = require('path')
const http = require('http') //socket io
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app) //create customize server
const io = socketio(server) 

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'../public')

app.use(express.static(publicPath)) 


io.on('connection',(socket) => {

    console.log('New WebSocket Connection')
    socket.on('join', (option, callback) => {

        const {error, user} = addUser({id: socket.id, ...option })

        if(error)
            return callback(error)
        
        socket.join(user.room)
        
        socket.emit('msg',generateMessage('Meet UP',`You R Welcome, ${user.username}`))
        socket.broadcast.to(user.room).emit('msg',generateMessage(`${user.username} Has Joined The Room`))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMsg', (msg,callback) => {
        
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('Profanity Is Not Allowed')
        }
        
        const user = getUser(socket.id)
        io.to(user.room).emit('msg', generateMessage(user.username,msg))
        callback()
    })

    socket.on('sendlocation', (coords, callback) => {
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('locationMessage', generateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('msg', generateMessage(`${user.username} Has Left The Meet Up`))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})
server.listen(port, () => {
    console.log('server in up on port ',port)
})
