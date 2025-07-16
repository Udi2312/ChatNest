const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const path = require('path');
const socketIO = require('socket.io');

const http = require('http');
const server = http.createServer(app);
const io = socketIO(server)

let waitingusers = [];
let rooms = {};

io.on('connection', function(socket){
   socket.on('joinroom', function(){
   if(waitingusers.length>0){
    let partner = waitingusers.shift();
    const roomname= `${socket.id}-${partner.id}`
    socket.join(roomname);
    partner.join(roomname);
    io.to(roomname).emit('joined')
   }
   else{
    waitingusers.push(socket);
   }
   })
})

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

server.listen(3000);
