const Model = require('./base')

class Users extends Model {
    static get tableName() {
        return "users"
    }


    static get encodedIdAttributes() {
        return ["id", ]
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }

    static get relationMappings() {

    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Users;
