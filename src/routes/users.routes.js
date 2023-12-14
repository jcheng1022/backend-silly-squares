import express from 'express';
import UserController from '../controllers/users.controllers'
import authGate from '../middleware/authGate';

const userRouter = express.Router();

userRouter.get('/me', authGate, UserController.getCurrentUser)
userRouter.get('/menu', authGate, UserController.getMenuData)
userRouter.get('/friends', authGate, UserController.getFriendsByUser)
userRouter.post('/friends/:friendId', authGate, UserController.sendFriendRequest)
userRouter.patch('/friends/:friendId/status/:status', authGate, UserController.updateFriendRequest)


userRouter.get('/search', authGate, UserController.getUsersBySearch)


userRouter.put('/profile', authGate, UserController.updateUserPresence)


export default userRouter;
