import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import response from "./utils/response";
import Tasks from './models/Tasks.model'
import userRouter from "./routes/users.routes";
import taskRouter from "./routes/tasks.routes";
import batchesRouter from "./routes/batches.router";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;

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


app.use('/tasks', taskRouter);
app.use('/user', userRouter);
app.use('/batches', batchesRouter);






app.get('/', async (req, res) => {
    res.send('Hi!')
});
app.get('/test', async (req, res) => {
    const data = await Tasks.query()

    return response(
        res, {
            code: 400,
            data
        }
    )
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
