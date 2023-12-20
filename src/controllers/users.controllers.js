
import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import _ from 'underscore'
import Users from '../models/Users.model'
import Batches from '../models/Batches.model'
import Tasks from '../models/Tasks.model'
import Friends from '../models/Friends.model'
import { raw } from 'objection'



import {decodeId} from "../utils/hashId";
import {FRIEND_STATUS} from "../utils/constants";
import dayjs from "dayjs";


class UsersController {

    @catchWrapper
    static async getCurrentUser(req,res) {


        return response(res, {
            code: 200,
            data: req.user
        })
    }
    @catchWrapper
    static async getMenuData(req,res) {

        // let data;
        const userId = decodeId(req.user.id)
        const selectOptions = ['id','name']

        const batches = await Batches.query()
            .withGraphFetched('tasks')
            .modifyGraph('tasks',
                    builder => builder.select([...selectOptions, 'batchId', 'status']))
            .select(selectOptions)
            .where({userId})
        const tasks = await Tasks.query().select([...selectOptions, 'batchId']).whereNull('batchId').andWhere({userId})

        const friendCount = await Friends.query().where({ status: 'ACCEPTED'}).andWhere(builder =>builder.where({requestedBy: userId}).orWhere({recipientId: userId}) ).count().first();

        return response(res, {
            code: 200,
            data: {
                batches,
                tasks,
                friendCount
            }
        })
    }

    @catchWrapper
    static async updateUserPresence(req,res) {
        if (!req.user) {
            throw `Missing user`
        }

        const presenceProps = ['firstName', 'lastName', 'username', 'lastVisited']

        let resultingEntry = _.pick(req.body, presenceProps)

        await Users.query().findById(decodeId(req.user.id)).patch({
            ...resultingEntry
        })


        return response(res, {
            code: 200,
            data: resultingEntry,
            message: 'Successfully updated user'
        })
    }


    @catchWrapper
    static async getFriendsByUser(req,res) {
        const {status = 'ACCEPTED', countsOnly} = req.query;

        if (!Object.values(FRIEND_STATUS).includes(status)) {
            throw `Not a valid friend status`
        }
        // let data;
        const userId = decodeId(req.user.id)

        let data;

        if (countsOnly ) {

             data = await Friends
                 .query()
                 .select([
                     Friends.query().where({ status: 'ACCEPTED' }).andWhere(qb => {
                         qb.where('recipient_id', userId).orWhere({requestedBy: userId});
                     }).count().as('accepted_count'),
                     Friends.query().where({ status: 'PENDING', recipient_id: userId }).count().as('pending_count')
                 ])
                 .first();


        } else {
            if (status === FRIEND_STATUS.ACCEPTED) {
                data = await Friends.query()
                    .withGraphFetched('[sender, recipient]')
                    .modifyGraph('sender',
                            builder => builder.select(['id', 'username']))
                    .modifyGraph('recipient',
                        builder => builder.select(['id', 'username']))
                    .where({status: FRIEND_STATUS.ACCEPTED})
                    .andWhere(builder => builder.where({recipientId: userId}).orWhere({requestedBy: userId}))

            } else if (status === FRIEND_STATUS.PENDING) {
                data = await Friends.query().withGraphFetched('sender').modifyGraph('sender', builder => builder.select(['id', 'username'])).where({recipientId: userId, status})
            }

        }





        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async getUsersBySearch(req,res) {
        const {username = ''} = req.query;
        if (!username) {
            throw `Missing username`
        }

        const userId = decodeId(req.user.id)
        const data = await Users.query().select(['id','username']).where('username', 'like', `%${username}%`).whereNot({id: userId})




        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async sendFriendRequest(req,res) {
        const {friendId} = req.params;
        if (!friendId) {
            throw `Missing friend ID`
        }

        // let data;
        const userId = decodeId(req.user.id)
        const friend = decodeId(friendId)
        if (friend === -1) {
            throw `Not valid friend ID`
        }
        const existing = await Friends.query().where({requestedBy: userId, recipientId: friend}).orWhere({recipientId: userId, requestedBy:friend}).first();

        if (existing) {
            if (existing.status === FRIEND_STATUS.ACCEPTED) {
                throw `Already friends`
            } else if (existing.status === FRIEND_STATUS.PENDING) {
                throw `Friend request exists already`
            } else if (existing.status === FRIEND_STATUS.DECLINED) {
                throw `User has previously declined the friend request`
            }
        }

       await Friends.query().insert({
            requestedBy: userId,
            recipientId: friend,
            status: FRIEND_STATUS.PENDING
        })



        return response(res, {
            code: 200,
            message: 'Success - Request Sent'
        })
    }

    @catchWrapper
    static async updateFriendRequest(req,res) {

        const {friendId, status = FRIEND_STATUS.ACCEPTED} = req.params;
        if (!friendId) {
            throw `Missing friend ID`
        }
        console.log(req.user.id, 22, decodeId(req.user.id), friendId, decodeId(friendId))

        // let data;
        const userId = decodeId(req.user.id)
        const friend = decodeId(friendId)

        if (friend === -1) {
            throw `Not valid friend ID`
        }

        console.log(userId, friend)
        const existing = await Friends.query().where({requestedBy: friend, recipientId: userId}).first();

        if (!existing) {
            throw `Could not find friend request`
        }

        if (existing?.status === FRIEND_STATUS.ACCEPTED ) {
            throw `Friend request has already been accepted`
        }
        await existing.$query().patch({
            status,
            acceptedDate: dayjs().format()
        })



        return response(res, {
            code: 200,
            message: 'Success - Request Updated'
        })
    }
}

export default UsersController;
