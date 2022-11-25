const express = require('express');

const socket = require('socket.io');

const http = require('http');

const fs = require('fs');

const app = express();

const server = http.createServer(app);

const io = socket(server);

let rooms = [];

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));
app.use('/img', express.static('./static/images'));

app.get('/', function(request, response) {
  fs.readFile('./static/index.html', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  });
});

io.on('connection', function(socket) {

  socket.on('joinRoom', async(msg) => {
    let roomCode = 'Room_' + msg;
    if(!rooms.includes(roomCode)) {
      rooms.push(roomCode)
    } else {

    }
    
    let roomName;

    if (roomCode.includes("dev")) {
      roomName = "개발팀";
    }
    if (roomCode.includes("des")) {
      roomName = "디자인팀";
    }
    if (roomCode.includes("ser")) {
      roomName = "서비스기획팀";
    }
    if (roomCode.includes("sma")) {
      roomName = "스마트사업팀";
    }
    if (roomCode.includes("acc")) {
      roomName = "회계팀";
    }

    socket.join(roomCode);

    io.to(roomCode).emit('update', {type: 'connect', name: 'SERVER', message: roomName+'방에 접속하였습니다.'});

    // socket.name = name;
    // io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'});

  });

  socket.on('message', function(data) {

    // socket.broadcast.emit('update', data);
    // let userCurrentRoom = getUserCurrentRoom(socket);
    let userCurrentRoom = 'Room_'+data.room;
    socket.broadcast.to(userCurrentRoom).emit('update', data);

  });

  socket.on('disconnect', function(data) {
    //socket.broadcast.to(userCurrentRoom).emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  });
});

server.listen(8080, function() {
  console.log('서버 실행 중...')
});

function getUserCurrentRoom(socket){
  let currentRoom = '';
  let socketRooms = rooms;

  for( let i = 0 ; i < socketRooms.length; i ++ ){
    if(socketRooms[i].indexOf('Room_') !== -1){
      currentRoom = socketRooms[i];
      break;
    }
  }
  return currentRoom;
}
