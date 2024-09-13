const Model = require('./base')
const Users = require("./Users.model.js");

class Games extends Model {
    static get tableName() {
        return "games"
    }


    static get encodedIdAttributes() {
        return ["id", "ownerId", "p1", "p2" ]
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }

    static get relationMappings() {
        const Users = require('../models/Users.model')
        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Games.tableName}.ownerId`,
                    to: `${Users.tableName}.id`,
                }
            },
            playerOne: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Games.tableName}.p1`,
                    to: `${Users.tableName}.id`,
                }
            },
            playerTwo: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Games.tableName}.p2`,
                    to: `${Users.tableName}.id`,
                }
            }
        }
    }

    $formatJson(json) {
        const data = super.$formatJson(json)
        data.hasPassword = !!json.password

        delete data.password

        return data;
    }
}


module.exports = Games;
