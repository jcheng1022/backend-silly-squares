const HashId = require('hashids/cjs')

const defaultHashId = new HashId('Emu532', 7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')

export const decodeId = (id) => {
    if (isNaN(id)) {
        return defaultHashId.decode(id)[0] ?? -1
    }
    return id;
}

export const encodeId = (id) => {
    if (!isNaN(id)) {
        return defaultHashId.encode(id)
    }
    return id;
}

export const isValidId = (id) => defaultHashId.isValidId(id)
