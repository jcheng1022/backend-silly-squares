import express from 'express';
import UserController from '../controllers/users.controllers'
import authGate from '../middleware/authGate';

const userRouter = express.Router();

userRouter.get('/me', authGate, UserController.getCurrentUser)

userRouter.get('/credits', authGate, UserController.getUserCredits)



export default userRouter;
