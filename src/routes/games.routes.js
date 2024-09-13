import express from 'express';
import UserController from '../controllers/users.controllers'
import authGate from '../middleware/authGate';
import GamesControllers from "../controllers/games.controllers.js";

const gamesRouter = express.Router();

gamesRouter.get('/lobbies', authGate, GamesControllers.getAllActiveGames)



export default gamesRouter;
