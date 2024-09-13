import {catchWrapper} from "../utils/errorHandling.js";
import response from "../utils/response.js";
import Games from "../models/Games.model.js"

class GamesControllers {
    @catchWrapper
    static async getAllActiveGames(req, res) {

        const activeGames = await Games.query()
            .withGraphFetched('owner')
            .modifyGraph('owner', builder => {
                builder.select(['id', 'name'])
            })
            .where({
            status: "OPEN"
        })

        return response(res, {
            code: 200,
            data:activeGames
        })
    }
}


export default GamesControllers
