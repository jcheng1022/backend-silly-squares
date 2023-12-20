const Model = require('./base')
const Tasks = require("./Tasks.model");
const Users = require("./Users.model");

class ResourceAccess extends Model {
    static get tableName() {
        return "resource_access"
    }


    static get encodedIdAttributes() {
        return ["id", 'userId', 'batchId','taskId']
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt", ]
    }

    static get relationMappings() {


        const Users = require('../models/Users.model')
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Friends.tableName}.userId`,
                }
            },

        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = ResourceAccess;
