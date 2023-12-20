import express from 'express';
import TaskController from '../controllers/tasks.controllers'
import authGate from '../middleware/authGate';
import BatchesController from "../controllers/batches.controllers";

const batchesRouter = express.Router();

batchesRouter.get('/', authGate, BatchesController.getAllBatches)
batchesRouter.post('/', authGate, BatchesController.createNewBatch)

batchesRouter.get('/:batchId', authGate, BatchesController.getBatchById)
batchesRouter.patch('/:batchId', authGate, BatchesController.updateBatchById)







export default batchesRouter;
