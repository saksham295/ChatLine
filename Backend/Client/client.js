const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function that will append event info to the container
const append = (message,position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play()
    }
}


// Ask new user for his name and let the server know
const name = prompt('Enter Your Name To Join the Chat');
socket.emit('new-user-joined', name);

// When new user joins receive his name from the server
socket.on('user-joined', name => {
    append(`${name} Joined The Chat`, 'left')
})

// If server sends a message receive it
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} Left The Chat`, 'left');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`, 'right')
    socket.emit('send',message);
    messageInput.value = ''
})