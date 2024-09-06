import express from "express";
import authGate from "../middleware/authGate";
import TaskControllers from "../controllers/task.controllers";
import usageLimit from "../middleware/usageLimit";

const taskRouter = express.Router();

taskRouter.post('/generate', authGate, usageLimit, TaskControllers.generateCodeTests)




export default taskRouter;
