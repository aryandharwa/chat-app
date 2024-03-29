const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const { parse } = require('path');
const bodyParser = require('body-parser');
const User = require('./model/userModel');
const messageRoute = require('./routes/messagesRoute');
const socket = require('socket.io');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

// app.post("/api/auth/register", register);
// app.post("/api/auth/login", login);

// app.post('/api/auth/register', (req, res) => {

//     const addUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//     });

//     addUser.save()
//     .then(doc => {
//         res.status(200).json(doc);
//     })
//     .catch(err => {
//         console.log(err);
//     });
// });

// app.post('/api/auth/login', (req, res) => {
//     console.log(req.body);
// });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: 'https://localhost:3000',
        credentials : true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-message", (message) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
});
