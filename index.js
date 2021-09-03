const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))


let users = {}


io.on('connection', socket => {


    socket.on('userLogins', (username) => {
        users[socket.id] = username
    
    })

    socket.on('test', (data) => {
        socket.broadcast.emit('test', data)
     
    })

    socket.on('giveOnlineStatus', (msg) => {
        socket.emit('takeOnlineStatus', users)
    })

    socket.on('disconnect', () => {
        delete users[socket.id]
    })
})






const PORT = process.env.PORT || 80

server.listen(PORT, () => console.log(`Listning to port ${PORT}`))