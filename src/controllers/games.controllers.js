import {catchWrapper} from "../utils/errorHandling.js";
import response from "../utils/response.js";
import Games from "../models/Games.model.js"
import {decodeId, encodeId} from "../utils/hashId.js";

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


    @catchWrapper
    static async createGame(req, res) {
        const {name, password = ''} = req.body

        const hashedPassword = !!password ? encodeId(password): null


        const newGame = await Games.query().insert({
            name,
            password: hashedPassword ?? null,
            ownerId: decodeId(req.user.id),
            p1: decodeId(req.user.id),
        })


        return response(res, {
            code: 200,
            message: "Successfully created game"
        })
    }
}


export default GamesControllers
