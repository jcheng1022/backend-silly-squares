import response from '../utils/response.js'
import Batches from '../models/Batches.model.js';
import {decodeId} from "../utils/hashId";


export default async (req, res, next) => {
    if (!req.params.batchId) {
        throw `Missing task ID`
    }
    const task = await Batches.query().findById(decodeId(req.params.batchId))

    if (decodeId(req.user.id) === task.userId){

        req.task = task;

    } else {
        return response(res, {
            code: 401,
            message: 'Unauthorized - Not Task Owner',
        });
    }



    return next();
};

