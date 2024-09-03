import response from "../utils/response";
import {catchWrapper} from "../utils/errorHandling";

class UserController {
    @catchWrapper
    static async getCurrentUser(req, res) {

        return response(res, {
            code: 200,
            data: req.user
        })
    }

}

export default UserController
