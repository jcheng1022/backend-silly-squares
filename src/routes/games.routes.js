import express from 'express';
import authGate from '../middleware/authGate';
import GamesControllers from "../controllers/games.controllers.js";

const gamesRouter = express.Router();

gamesRouter.get('/lobbies', authGate, GamesControllers.getAllActiveGames)
gamesRouter.post('/', authGate, GamesControllers.createGame)

gamesRouter.get('/:gameId', authGate, GamesControllers.getGameById)

gamesRouter.get('/:gameId/players', authGate, GamesControllers.getPlayers)
gamesRouter.patch('/:gameId/join', authGate, GamesControllers.joinGame)
gamesRouter.patch('/:gameId/status/:type', authGate, GamesControllers.updateGameStatus)

gamesRouter.patch("/:gameId/ready", authGate, GamesControllers.toggleReadyStatus)
gamesRouter.get("/:gameId/ready-status", authGate, GamesControllers.getGameReadyStatuses)



export default gamesRouter;
