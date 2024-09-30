import {catchWrapper} from "../utils/errorHandling.js";
import response from "../utils/response.js";
import Games from "../models/Games.model.js"
import {decodeId, encodeId} from "../utils/hashId.js";
import {GAME_STATE} from "../utils/constants.js";

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
    static async getGameById(req, res) {
        const {gameId} = req.params
        const {withPlayers = false } = req.query

        if (!gameId) throw `Missing Game ID`
        // const query = Games.query().findById(decodeId(gameId))

        // if (withPlayers) query.withGraphFetched('[playerOne,playerTwo]')

        const game = await Games.query().findById(decodeId(gameId))

        return response(res, {
            code: 200,
            data:game
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
            status: GAME_STATE.WAITING_JOIN
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
                playerOne: {
                    id: encodeId(game?.playerOne?.id),
                    name: game?.playerOne?.name,
                    isReady: game?.p1Ready
                },
                playerTwo: {
                    id: encodeId(game?.playerTwo?.id),
                    name: game?.playerTwo?.name,
                    isReady: game?.p2Ready
                }
            },

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


    @catchWrapper
    static async toggleReadyStatus(req, res) {
        const {gameId} = req.params


        const game = await Games.query().findById(decodeId(gameId))

        if (!game) throw `Game not found`

        if (!game?.p1 || !game?.p2) throw `Game is missing players`

        if (game?.p1 !== decodeId(req.user.id) && game?.p2 !== decodeId(req.user.id)) throw `You are not in the game`

        if (game?.p1 === decodeId(req.user.id)) {
            await game.$query().patch({
                p1Ready: !game?.p1Ready
            }).where({
                id: game.id
            })
        } else {
            await game.$query().patch({
                p2Ready: !game?.p2Ready
            }).where({
                id: game.id
            })
        }

        return response(res, {
            code: 200,
            message: "Successfully joined game"
        })
    }


    @catchWrapper
    static async getGameReadyStatuses(req, res) {
        const {gameId} = req.params


        const game = await Games.query().findById(decodeId(gameId))

        if (!game) throw `Game not found`

        let playersAreReady = false

        if (!!game?.p1Ready && !!game?.p2Ready) {
            playersAreReady = true
        }

        return response(res, {
            code: 200,
            data: {
                playersAreReady
            }
        })
    }


    @catchWrapper
    static async updateGameStatus(req, res) {
        const {gameId, type} = req.params

        if (!type) throw `Missing status update type`

        if (!Object.values(GAME_STATE).find(o => o === type)) throw `Invalid status update type`

        if (!gameId) throw `Missing Game ID`

        const game = await Games.query()
            .findById(decodeId(gameId))

        if (!game)  throw `Game not found`

        const currentStatus = game?.status

        if (currentStatus === type) throw `Game is already ${type}`

        await game.$query().patch({
            status: type
        })







        return response(res, {
            code: 200,
            message: `Successfully updated game status to ${type}`
        })
    }
}


export default GamesControllers
