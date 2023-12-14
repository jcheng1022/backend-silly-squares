import response from './response.js'

export function catchWrapper(target, key, descriptor) {
    const fn = descriptor.value

    descriptor.value = async function(...args) {
        const res = args[1]
        try {
            return await fn.apply(this, args)
        } catch (err) {
            console.log("Caught: ", err)
            if (!err || (typeof err !== 'string' && err.sqlMessage)) {
                err = 'Unexpected error occurred'
            }

            const keys = typeof err === "object" ? Object.keys(err) : []
            const banList = ["TypeError", "DBerror", "DataError", "CheckViolationError", "NotNullViolationError", "UniqueViolationError", "nativeError"]

            for (const item of banList) {
                if (err.toString()?.includes(item) || keys.indexOf(item) > -1) {
                    err = 'Unexpected error occurred'
                }
            }

            const status = err.statusCode || typeof err === 'string' ? 400 : 500

            return response(res, {
                code: status >= 500 ? status : 400,
                message: typeof err === "string" ? err : err.message || "An unexpected error occurred. Please try again later.",
            })
        }
    }
}
