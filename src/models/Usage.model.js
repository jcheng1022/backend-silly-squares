const Model = require('./base')

class Usage extends Model {
    static get tableName() {
        return "usage"
    }


    static get encodedIdAttributes() {
        return ["id", "userId"]
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


module.exports = Usage;
