import Usage from "../models/Usage.model";
import {decodeId} from "../utils/hashId";

export const DAILY_USAGE_LIMIT = 10
export const WEEKLY_USAGE_LIMIT = 50
export default async (req, res, next) => {


    if (!req.user) {
        throw `Missing User for Usage`
    }

    const userUsage = await Usage.query().where({userId: decodeId(req.user.id)}).first()
    // console.log(userUsage, 'usage')
    // throw 'test'

    // if no usage record, create one

    if (!userUsage) {

        req.usage = await Usage.query().insert({
            userId: decodeId(req.user.id),
            dailyUsage: 2,
            weeklyUsage: 2
        })


        return next();
    }


    // convert string to num

    const dailyUsage = parseInt(userUsage.dailyUsage)
    const weeklyUsage = parseInt(userUsage.weeklyUsage)

    // daily check

    if (dailyUsage === 0) {

        return res.status(429).json({
            message: 'Daily usage limit reached'
        })
    }

    // weekly check

    if (weeklyUsage === 0) {
        return res.status(429).json({
            message: 'Weekly usage limit reached'
        })
    }

    req.usage = userUsage

    return next();
}
