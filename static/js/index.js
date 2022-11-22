var socket = io();

socket.on('connect', function() {
    let name = prompt('반갑습니다!', '')

    if(!name) {
        name = '익명'
    }

    socket.emit('newUser', name)
})

socket.on('update', function(data) {
    let chat = document.getElementById('chat')

    let message = document.createElement('div')

    let node = document.createTextNode(`${data.name}: ${data.message}`)
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
})

function send() {
    let message = document.getElementById('test').innerText

    document.getElementById('test').innerText = ''

    let chat = document.getElementById('chat')
    let msg = document.createElement('div')
    let node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)

    socket.emit('message', {type: 'message', message: message})
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
}

function enterkey() {
    if (window.event.keyCode == 13) {
        send();
    }
    let length = document.getElementById('test').innerText.length;
    if (length > 0) {
        $(".btnSend").css('background-color', '#3395ff');
    } else {
        $(".btnSend").css('background-color', 'lightgray');
    }

}




