document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const sendButton = document.getElementById('send-button');

    let username = '';

    // メッセージを受信したときの処理
    socket.on('message', (data) => {
        appendMessage(data);
    });

    // メッセージを送信する処理
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            if (username === '') {
                username = usernameInput.value.trim() || 'Anonymous';
            }
            socket.emit('message', { username, message });
            messageInput.value = '';
        }
    });

    // メッセージを表示する処理
    function appendMessage(data) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span class="message-username">${data.username}</span>: <span class="message-text">${data.message}</span>`;
        messageContainer.appendChild(messageElement);
    }
});
