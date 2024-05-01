const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ポート番号の設定
const PORT = process.env.PORT || 443;

// データベースの初期化
const db = new sqlite3.Database('chat.db');

// テーブルの作成
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 静的ファイルの提供
app.use(express.static('public'));

// ユーザーが接続したときの処理
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // 過去のメッセージを送信
    db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20', (err, rows) => {
        if (err) {
            console.error('Error retrieving messages from database:', err);
        } else {
            // 最新のメッセージから古いメッセージへ
            rows.reverse().forEach(row => {
                socket.emit('message', { username: row.username, message: row.message });
            });
        }
    });

    // 新しいメッセージを受信し、データベースに保存
    socket.on('message', (data) => {
        const { username, message } = data;
        db.run('INSERT INTO messages (username, message) VALUES (?, ?)', [username, message], (err) => {
            if (err) {
                console.error('Error inserting message into database:', err);
            }
        });
        io.emit('message', { username, message });
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
