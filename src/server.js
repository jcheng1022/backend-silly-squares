import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/users.routes";
import {initializeApp} from "firebase-admin/app";
import Anthropic from '@anthropic-ai/sdk';

import admin from 'firebase-admin'
import taskRouter from "./routes/task.routes";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;


export let firebaseApp;
if (process.env.FIREBASE_ADMIN) {
    firebaseApp = initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN)),
        // storageBucket: process.env.STORAGE_BUCKET
    })
}

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});


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

app.use('/task', taskRouter)





app.get('/', async (req, res) => {
    res.send('Hi!')
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
