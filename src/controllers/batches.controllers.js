
import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import _ from 'underscore'
import Batches from '../models/Batches.model'
import {decodeId} from "../utils/hashId";


class BatchesController {


    @catchWrapper
    static async getAllBatches(req,res) {

        const data = await Batches.query().where({userId: decodeId(req.user.id)})


        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async createNewBatch(req,res) {


        const batchFormProps = ['name', 'description']

        let resultingEntry = _.pick(req.body, batchFormProps)
        // const existing = await Batches.query().where({name: 'Untitled', userId: decodeId(req.user.id)}).count().first();
        const existing = await Batches.query().where('name', 'like', `%Untitled%`).andWhere('userId', decodeId(req.user.id)).count().first();

        const body = {
            ...resultingEntry,
            userId: decodeId(req.user.id),
            name: `Untitled ${parseInt(existing?.count) + 1}`
        }

        await Batches.query().insert(body)


        return response(res, {
            code: 200,
            message:'Success'
        })
    }


    @catchWrapper
    static async getBatchById(req,res) {
        const { withTasks = false } = req.query;
        const {batchId} = req.params;


        const query =  Batches.query().findById(decodeId(batchId))
        let data;

        if (!!withTasks) {
            data =  await query.withGraphFetched('tasks')
                .modifyGraph('tasks', builder => builder.select(['id', 'name', 'batchId', 'status']))
        } else {
            data = await query;
        }

        // if (decodeId(req.user.id) !== parseInt(data.userId)) {
        //     throw `Unauthorized - Not the created user`
        // }


        return response(res, {
            code: 200,
            data
        })
    }

}

export default BatchesController;
