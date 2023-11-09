const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 8000;
const socket = require('socket.io');

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());   
app.use(cookieParser());        
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config');
require('./routes/customer.routes')(app);

const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});

const io = socket(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
});

io.on("connection", socket => {
    console.log('socket id: ' + socket.id);
    socket.emit("Welcome", "Message From Socket.io: Form Was Submitted Successfully!");
    socket.on("event_from_client", data => {
        io.emit("event_to_all_other_clients", data);
    });
    socket.on("approve_post", (postId) => {
        console.log("Product approved: " + postId);
    });
    socket.on("reject_post", (postId) => {
        console.log("Product rejected: " + postId);
    });
});