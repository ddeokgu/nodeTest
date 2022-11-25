var socket = io();

socket.on('connect', function() {
   /*let name = prompt('이름을 입력해 주세요.', '');

    if(!name) {
        name = '익명'
    }*/

});


socket.on('update', function(data) {
    let chat = document.getElementById('chat')

    let message = document.createElement('div')

    let node = document.createTextNode(`${data.name}: ${data.message}`);

    let className = ''

    switch(data.type) {
        case 'message':
            className = 'other'
            break

        case 'connect':
            className = 'connect'
            break

        case 'disconnect':
            className = 'disconnect'
            break
    }

    message.classList.add(className)
    message.appendChild(node)
    chat.appendChild(message)

    $('#chat').scrollTop($('#chat')[0].scrollHeight);
});

function send() {

    let message = document.getElementById('text').innerText
    let room = $("#select-room").prop('selected', true).val();
    let name = $("#hiddenName").val();

    if(room === 'none') {
        return alert("방을 선택해 주세요.");
    }

    document.getElementById('text').innerText = '';

    $('.btnSend').removeClass('btnOn');

    let chat = document.getElementById('chat');
    let msg = document.createElement('div');
    let node = document.createTextNode(message);
    msg.classList.add('me');
    msg.appendChild(node);
    chat.appendChild(msg);

    socket.emit('message', {type: 'message', message: message, room : room, name : name});
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
}

function roomSelect() {
    let roomName = $("#select-room").val();
    if(roomName === 'none') {
        return alert('방을 선택해주세요.')
    } else {
        socket.emit('joinRoom', roomName);
    }
}

function enterkey() {
    let length = document.getElementById('text').innerText.length;
        console.log(length);
        console.log('text = ' + document.querySelector("#text").innerText);
    if (window.event.keyCode == 13) {
        if (document.querySelector("#text").innerText == '' || document.querySelector("#text").innerText == ' ' ) {
            return false;
        }
            send();
        };
    if (length > 0) {
        // $(".btnSend").css('background-color', '#91b9e5');
        $(".btnSend").addClass('btnOn');
    } else {
        // $(".btnSend").css('background-color', 'lightgray');
        $(".btnSend").removeClass('btnOn');
    }

}

function goUp() {
    $("#chat").animate({scrollTop :0}, 800);
}

