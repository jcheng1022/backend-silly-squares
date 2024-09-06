import Usage from "../models/Usage.model";
import {decodeId} from "../utils/hashId";

export const DAILY_USAGE_LIMIT = 10
export const WEEKLY_USAGE_LIMIT = 70
export default async (req, res, next) => {


    if (!req.user) {
        throw `Missing User for Usage`
    }

    const userUsage = await Usage.query().where({userId: decodeId(req.user.id)}).first()

    // daily check

    if (userUsage?.dailyUsage >= DAILY_USAGE_LIMIT) {
        return res.status(429).json({
            message: 'Daily usage limit reached'
        })
    }

    // weekly check

    if (userUsage?.weeklyUsage >= WEEKLY_USAGE_LIMIT) {
        return res.status(429).json({
            message: 'Weekly usage limit reached'
        })
    }

    return next();
}
