import dayjs from "dayjs";
import Tasks from "../models/Tasks.model";
import {decodeId} from "../utils/hashId";

class TasksServices {

    static async getTodaysTasks(userId) {
        const today = dayjs();
        const startOfDay = today.startOf('day');
        const endOfDay = today.endOf('day');

       return Tasks.query()
            .where({
                userId
            })
           .andWhereNot({status: 'COMPLETE'})
           .andWhereNot({isTrashed: true})
            .andWhere('date', '>=', startOfDay.toDate())
            .andWhere('date', '<', endOfDay.toDate());
    }
    static async updateStatusToComplete(taskIds, userId) {
        return Tasks.query()
            .whereIn('id', taskIds)
            .andWhere({
                userId
            })
            .update({
                status:'COMPLETE'
            })
    }
    static async moveToTrash(taskIds, userId) {
        return Tasks.query()
            .whereIn('id', taskIds)
            .andWhere({
                userId
            })
            .update({
                isTrashed: true
            })
    }

    static async restoreTasks(taskIds, userId) {
        return Tasks.query()
            .whereIn('id', taskIds)
            .andWhere({
                userId
            })
            .update({
                isTrashed: false
            })
    }


    static async getAllTasks(userId) {
        return Tasks.query()
            .where({
                userId
            })
            .where({isTrashed: false})
    }
    static async getTaskByCompletionStatus(userId, range) {
        return Tasks.query()
            .where({
                userId
            })
            .andWhere({status: range.toUpperCase()})

    }
    static async getImportantTasks(userId) {

        return Tasks.query()
            .where({
                userId
            })
            .whereNot('status', 'COMPLETE')
            .andWhere({isImportant: true})

    }

    static async getTrashedTasks(userId) {
        return Tasks.query()
            .where({
                userId
            })
            .where({isTrashed: true })
    }

}


export default TasksServices;
