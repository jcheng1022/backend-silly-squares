import express from 'express';
import TaskController from '../controllers/tasks.controllers'
import authGate from '../middleware/authGate';
import taskOwnerGate from "../middleware/taskOwnerGate";
import {RESOURCE_TYPES} from "../utils/constants";

const taskRouter = express.Router();

taskRouter.get('/me', authGate, TaskController.getAllTasksByUser)

taskRouter.get('/range/:range', authGate, TaskController.getTasksByRange)

// taskRouter.get('/today', authGate, TaskController.getTodaysTasks)
taskRouter.post('/', authGate, TaskController.createNewTask)
taskRouter.patch('/:status', authGate,TaskController.updateTaskStatus)

taskRouter.get('/:taskId', authGate, taskOwnerGate(RESOURCE_TYPES.TASKS), TaskController.getTaskById)
taskRouter.patch('/:taskId/details', authGate, taskOwnerGate(RESOURCE_TYPES.TASKS), TaskController.updateTaskDetails)






export default taskRouter;
