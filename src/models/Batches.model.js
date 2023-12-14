const Model = require('./base')

class Batches extends Model {
    static get tableName() {
        return "batches"
    }


    static get encodedIdAttributes() {
        return ["id", 'userId', 'batchId']
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }

    static get relationMappings() {

        const Tasks = require('../models/Tasks.model')
        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: Tasks,
                join: {
                    from: `${Tasks.tableName}.batchId`,
                    to: `${Batches.tableName}.id`,
                }
            },
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Batches;
