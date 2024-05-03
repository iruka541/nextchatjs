const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ポート番号の設定
const PORT = process.env.PORT || 80;

// 静的ファイルの提供
app.use(express.static('public'));

// ユーザーが接続したときの処理
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // 過去のメッセージを送信
    // ここで過去のメッセージを送信する処理がある場合はそのまま残します

    // 新しいメッセージを受信
    socket.on('message', (data) => {
        // 新しいメッセージを受信した際の処理を記述します
        io.emit('message', data); // 受信したメッセージを全てのクライアントに送信
    });

    // ユーザーが切断したときの処理
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
});

// サーバーを指定されたポートで起動
server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
