
const { response } = require('express');
const express = require('express'); //express is framework for node js, used to build web application
const app = express();
const server = require('http').Server(app);  // for server
const io = require('socket.io')(server); //imported socket.io for the communication between server and user
const { v4: uuidv4 } = require('uuid'); //import uuid in the server
const { ExpressPeerServer } = require('peer');  //for importing peerjs
const peerServer = ExpressPeerServer(server, {
    debug: true
})
app.set('view engine','ejs'); //for html file 
app.use(express.static('public')); //for the video

//route
app.use('/peerjs', peerServer);
app.get('/',(req, res) => {
    res.redirect(`/${uuidv4()}`); //new route
 })

//new url for new room
app.get('/:room',(req,res) => {
    res.render('room',{ roomId: req.params.room })
})

//the user request to join room will be accepted
io.on('connection',socket => {
    socket.on('join-room',(roomId, userId) => {
       socket.join(roomId); //user can join with room id
       socket.broadcast.emit('user-connected', userId); //it broadcast that the user has connected and now you can add them to your stream
        // console.log("Joined room"); //shows on log that means function is working
    socket.on('message',message => {
        io.to(roomId).emit('createMessage', message)
    })
    })
})
//we have to tell socket that we have joined the room




server.listen(3030); //server is local host and port is 3030