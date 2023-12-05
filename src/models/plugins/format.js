
module.exports = (ModelClass) => {
    return class extends ModelClass {
        $formatJson(json) {
            const HashId = require('hashids/cjs')

            const defaultHashId = new HashId('Emu532', 7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')

            const encodeId = (id) => {
                if (!isNaN(id)) {
                    return defaultHashId.encode(id)
                }
                return id;
            }

            let formattedJson = super.$formatJson(json)
            const modelClass = this.constructor
            const {numeric = [], encodedIdAttributes, hidden = [], encodedIdSkipped = []} = modelClass

            if (numeric.length > 0) {
                for (const key of numeric) {
                    if (key in formattedJson) {
                        formattedJson[key] = Number(json[key])
                    }
                }
            }

            if (encodedIdSkipped?.length) {
                for (const key of encodedIdSkipped) {
                    formattedJson[`decoded${key}`] = json[key]
                }
            }

            if (encodedIdAttributes) {
                formattedJson = encodedIdAttributes.reduce((json, encodedIdAttribute) => {
                    if (!json[encodedIdAttribute]) {
                        return json
                    }

                    json[encodedIdAttribute] = encodeId(json[encodedIdAttribute])

                    return json
                }, formattedJson)
            } else if (formattedJson.id) {
                formattedJson.id = encodeId(formattedJson.id)
            }


            for (const attr of hidden) {
                delete formattedJson[attr]
            }

            delete formattedJson.deletedAt

            return formattedJson
        }
    }
}
