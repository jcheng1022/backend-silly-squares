import response from '../utils/response.js'
import Users from '../models/Users.model.js';
import AuthService from "../services/auth.service";
import admin from 'firebase-admin'
import UsersService from "../services/user.services";

export default async (req, res, next) => {

    if (req.headers?.authorization ){
        try {
            const { isAdmin = false } = req.query
            const token = req.headers?.authorization.replace('Bearer ', '')
            const { uid, email } = await AuthService.verifyIdToken(token,isAdmin)

            if (!uid) {
                console.log(`Error: could not verify token`)
                return response(res, {
                    code: 401,
                    message: 'Unauthorized',
                });
            }

            const user = await Users.query().where({firebaseUuid: uid}).first();

            if (!user) {
                console.log(`Creating new user from firebase`)
                // user does not exist yet; create one
                const firebaseUser = await admin.auth().getUser(uid)

                const newUser = await UsersService.createNewUserFromFirebase(firebaseUser)

                req.user = newUser
            } else {

                // check if they have a knock account registered ( for notifications )


                req.user = user
            }

        } catch (error) {
            console.log(`Error verifying token: ${error.message}`)
            return response(res, {
                code: 401,
                message: 'Unauthorized Token',
            });
        }


    } else {
        console.log(`No authorization header`)
        return response(res, {
            code: 401,
            message: 'Unauthorized',
        });
    }


    req.accessToken = req.headers?.authorization.replace('Bearer ', '')
    return next();
};

