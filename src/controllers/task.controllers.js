import {catchWrapper} from "../utils/errorHandling";
import response from "../utils/response";
import ClaudeService from "../services/claude.service";

class TaskControllers {

    @catchWrapper
    static async generateCodeTests(req, res) {
        const data = await ClaudeService.askClaude(req.body.data)
        return response(res,{
            code: 200,
            data
        })
    }

}

export default TaskControllers
