import express from "express";
import authGate from "../middleware/authGate";
import UserController from "../controllers/users.controllers";
import TaskControllers from "../controllers/task.controllers";

const taskRouter = express.Router();

taskRouter.post('/generate', authGate, TaskControllers.generateCodeTests)




export default taskRouter;
