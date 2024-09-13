const Model = require('./base')

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
            }
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Games;
