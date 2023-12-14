const Model = require('./base')
const Tasks = require("./Tasks.model");
const Users = require("./Users.model");

class Friends extends Model {
    static get tableName() {
        return "friends"
    }


    static get encodedIdAttributes() {
        return ["id", 'requestedBy', 'recipientId']
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt", "acceptedDate"]
    }

    static get relationMappings() {


        const Users = require('../models/Users.model')
        return {
            sender: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Friends.tableName}.requestedBy`,
                }
            },
            recipient: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Friends.tableName}.recipientId`,
                }
            },
            // requestedBy: {
            //     relation: Model.BelongsToOneRelation,
            //     modelClass: Users,
            //     join: {
            //         from: `${Users.tableName}.id`,
            //         to: `${Friends.tableName}.requestedBy`,
            //     }
            // },
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Friends;
