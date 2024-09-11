import Users from '../models/Users.model'
import {decodeId} from "../utils/hashId";
import Usage from "../models/Usage.model";

class UserServices {

    static async isValidUser(userId) {

        if (!userId) throw `Missing User`

        const id = typeof userId === 'string' ? decodeId(userId) : userId

        const {count} = await Users.query().where({
            id
        }).count().first()

        if (parseInt(count) === 0) return false

        return true
    }
    static async createNewUserFromFirebase(user) {

        // create the user
        const newUser = await Users.query().insert({
            firebaseUuid: user?.uid,
            email: user?.email,
            name: user?.displayName,
            // username: generateUsername(user?.displayName)

        })

        await Usage.query().insert({
            userId: newUser.id,
            dailyUsage: 2,
            weeklyUsage: 2
        })


        return newUser;
    }

}


export default UserServices
