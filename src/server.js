import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/users.routes";
import {initializeApp} from "firebase-admin/app";
import { Server } from 'socket.io';
import { createServer } from 'node:http';


import admin from 'firebase-admin'
import gamesRouter from "./routes/games.routes.js";

dotenv.config();


const app = express();

const PORT = process.env.PORT || 8080;

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // your frontend URL
        methods: ["GET", "POST"]
    }
});


export let firebaseApp;
if (process.env.FIREBASE_ADMIN) {
    firebaseApp = initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN)),
        // storageBucket: process.env.STORAGE_BUCKET
    })
}


const knexStringcase = require('knex-stringcase');
const knex = require('knex')
const { Model } = require('objection')

const options = knexStringcase({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations'
    }
})


const knexInstance = knex(options)
Model.knex(knexInstance)
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors())

app.use('/user', userRouter)
app.use('/games', gamesRouter)





app.get('/', async (req, res) => {
    res.send('Hi!')
});


io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    // Example action handler
    socket.on('userAction', (data) => {
        console.log('User action received:', data);
        // Process the action here
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
