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
    let roomName = 'Room_' + msg;
    if(!rooms.includes(roomName)) {
      rooms.push(roomName)
    } else {

    }

    socket.join(roomName);

    io.to(roomName).emit('update', {type: 'connect', name: 'SERVER', message: '방에 접속하였습니다.'});

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
  console.log('socketRooms = ' + socketRooms);

  for( let i = 0 ; i < socketRooms.length; i ++ ){
    if(socketRooms[i].indexOf('Room_') !== -1){
      currentRoom = socketRooms[i];
      break;
    }
  }
  return currentRoom;
}
