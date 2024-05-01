const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ポート番号の設定
const PORT = process.env.PORT || 80;

// メッセージを保存するJSONファイルのパス
const messagesFilePath = 'messages.json';

// データベースの初期化
let messages = [];

// JSONファイルからメッセージを読み込む
try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
} catch (err) {
    console.error('Error reading messages from file:', err);
}

// 静的ファイルの提供
app.use(express.static('public'));

// ユーザーが接続したときの処理
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // 過去のメッセージを送信
    messages.slice(-20).forEach(message => {
        socket.emit('message', message);
    });

    // 新しいメッセージを受信し、JSONファイルに保存
    socket.on('message', (data) => {
        messages.push(data);
        fs.writeFile(messagesFilePath, JSON.stringify(messages), (err) => {
            if (err) {
                console.error('Error writing message to file:', err);
            }
        });
        io.emit('message', data);
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
