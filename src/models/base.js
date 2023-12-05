const {Model} = require('objection')
const formatPlugin = require('./plugins/format')
const plugins = [formatPlugin]

module.exports = plugins.reduce((base, plugin) => {
    return plugin(base)
}, Model)
