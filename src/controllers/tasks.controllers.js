import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import dayjs from "dayjs";
import Tasks from '../models/Tasks.model'
import {decodeId} from "../utils/hashId";
import _ from "underscore";
import TasksServices from "../services/tasks.services";

class TasksController {

    @catchWrapper
    static async getTodaysTasks(req,res) {

        const today = dayjs();
        const startOfDay = today.startOf('day');
        const endOfDay = today.endOf('day');

        const data = await Tasks.query()
            .where({
                userId: decodeId(req.user.id),
            })
            .where('date', '>=', startOfDay.toDate())
            .where('date', '<', endOfDay.toDate());

        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async getAllTasksByUser(req,res) {

        const data = await Tasks.query().where({
            userId: decodeId(req.user.id)
        })
        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async createNewTask(req,res) {

        const taskFormProps = ['date', 'name', 'description', 'subtaskList', 'batchId']

        let resultingEntry = _.pick(req.body, taskFormProps)
        await Tasks.query().insert({
            ...resultingEntry,
            batchId: !!resultingEntry.batchId ? decodeId(resultingEntry.batchId) : null,
            subtaskList: JSON.stringify(resultingEntry?.subtaskList),
            userId: decodeId(req.user.id)
        })

        return response(res, {
            code: 200,
            message: 'Success'
        })
    }

    @catchWrapper
    static async getTasksByRange(req,res) {
        const {range = 'today'} = req.params;
        let data;
        switch (range){
            case 'today':
                data = await TasksServices.getTodaysTasks(decodeId(req.user.id));
                break;
            case 'all':
                data = await TasksServices.getAllTasks(decodeId(req.user.id));
                break;
            case 'trashed':
                data = await TasksServices.getTrashedTasks(decodeId(req.user.id));
                break;
            case 'important':
                data = await TasksServices.getImportantTasks(decodeId(req.user.id));
                break;
            case 'pending':
            case 'incomplete':
                data = await TasksServices.getTaskByCompletionStatus(decodeId(req.user.id), range);
                break;
        }

        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async updateTaskStatus(req,res) {

        const {status = 'complete'} = req.params;

        if (!req.body) {
            throw `Missing tasks to be updated`
        }
        const taskIds = req.body.map(taskId => decodeId(taskId))

        const userId = decodeId(req.user.id)
        switch(status) {
            case 'complete':
                await TasksServices.updateStatusToComplete(taskIds, userId)
                break;
            case 'trash':
                await TasksServices.moveToTrash(taskIds, userId);
                break;
            case 'restore':
                await TasksServices.restoreTasks(taskIds, userId);
                break;
        }

        return response(res, {
            code: 200,
            message: 'Success'
        })
    }

    @catchWrapper
    static async getTaskById(req,res) {

        return response(res, {
            code: 200,
            data: req.task
        })
    }

    @catchWrapper
    static async updateTaskDetails(req,res) {

        const batchFormProps = ['name', 'description', 'subtaskList']

        let resultingEntry = _.pick(req.body, batchFormProps)

        await req.task.$query().patch({
            ...resultingEntry,
            subtaskList: JSON.stringify(resultingEntry.subtaskList),
            updated_at: dayjs().format()
        })

        return response(res, {
            code: 200,
            message: 'Updated'
        })
    }

}

export default TasksController;
