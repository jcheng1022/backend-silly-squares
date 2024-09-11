import {catchWrapper} from "../utils/errorHandling";
import response from "../utils/response";
import ClaudeService from "../services/claude.service";
import Usage from "../models/Usage.model";
import {decodeId} from "../utils/hashId";

class TaskControllers {

    @catchWrapper
    static async generateCodeTests(req, res) {
        const data = await ClaudeService.askClaude(req.body.data)



        if (!!req.usage) {
            const  currentUsage = {
                dailyUsage: parseInt(req.usage.dailyUsage) - 1,
                weeklyUsage: parseInt(req.usage.weeklyUsage) - 1
            }
            await req.usage.$query().patch(currentUsage)

        } else {
            const userUsage = Usage.query().where({userId: decodeId(req.user.id)}).first()

            const  currentUsage = {
                dailyUsage: parseInt(userUsage.dailyUsage) - 1,
                weeklyUsage: parseInt(userUsage.weeklyUsage) - 1
            }

            await userUsage.$query().patch(currentUsage)

        }


        return response(res,{
            code: 200,
            data
        })
    }

}

export default TaskControllers
