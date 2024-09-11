import response from "../utils/response";
import {catchWrapper} from "../utils/errorHandling";
import Usage from "../models/Usage.model";
import {decodeId} from "../utils/hashId";

class UserController {
    @catchWrapper
    static async getCurrentUser(req, res) {

        return response(res, {
            code: 200,
            data: req.user
        })
    }

    @catchWrapper
    static async getUserCredits(req, res) {

        const usage = await Usage.query().where({
            userId: decodeId(req.user.id)
        }).first();

        if (!usage) throw `No usage record found for user, try again later`





        return response(res, {
            code: 200,
            data: {
                dailyUsage: usage.dailyUsage,
                weeklyUsage: usage.weeklyUsage
            }
        })
    }


}

export default UserController
