


 import express from 'express';
import dotenv from 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { errorHandler, notFound } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import serverRoutes from './routes/serverRoute.js';
import channelRoutes from './routes/channelRoute.js';
import messageRoutes from './routes/messageRoute.js';
import conversationRoutes from './routes/conversationRoute.js';
import { dbConnect } from './config/dbConnect.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();


const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    }
});

app.use(morgan("dev"));
app.use(bodyParser.json({"limit": "30mb", extended: true})); // 30mb because we will send images
app.use(bodyParser.urlencoded({"limit": "30mb", extended: true}));
app.use(cookieParser());

app.use(cors());


app.use('/messages', messageRoutes);
app.use('/servers', serverRoutes);
app.use('/channels', channelRoutes);
app.use('/conversations', conversationRoutes);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/', async (req, res) => {
    res.json("Server is Running");
});


app.set("io", io);



io.on("connection", (socket) => {
    console.log("📡 New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});


// app.use('/listings', listingRoutes);
// app.use('/reservations', reservationRoutes)






app.listen(5000, () => {
    console.log('Server is running on port', 5000)
});
dbConnect();


