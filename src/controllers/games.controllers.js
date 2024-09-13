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
            status: "OPEN"
        })


        return response(res, {
            code: 200,
            data:newGame,
            message: "Successfully created game"
        })
    }


    @catchWrapper
    static async getPlayers(req, res) {
        const {gameId} = req.params

        const game = await Games.query()
            .withGraphFetched('[playerOne,playerTwo]')
            .modifyGraph('playerOne', builder => {
                builder.select('id','name')
            })
            .modifyGraph('playerTwo', builder => {
                builder.select('id','name')
            })
            .findById(decodeId(gameId))

        if (!game)  throw `Game not found`




        return response(res, {
            code: 200,
            data: {
                playerOne: game?.playerOne,
                playerTwo: game?.playerTwo
            },
            message: "Successfully created game"
        })
    }


    @catchWrapper
    static async joinGame(req, res) {
       const {gameId} = req.params


        const game = await Games.query().findById(decodeId(gameId))

        if (!game) throw `Game not found`

        if (game.p2) throw `Game is full`

        if (game?.p1 === decodeId(req.user.id) || game?.p2 === decodeId(req.user.id)) throw `You are already in the game`

        if (game?.p1 === null) {
            await game.$query().patch({
                p1: decodeId(req.user.id)
            }).where({
                id: game.id
            })
        } else {
            await game.$query().patch({
                p2: decodeId(req.user.id)
            }).where({
                id: game.id
            })
        }

        return response(res, {
            code: 200,
            message: "Successfully joined game"
        })
    }
}


export default GamesControllers
