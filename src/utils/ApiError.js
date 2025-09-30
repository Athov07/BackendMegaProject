class ApiError extends Error {
    constructor(
            statusCode,
            message= "Something went wrong",
            errors= [],
            stake= ""
        ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.errors = errors
        this.success = false

        if (stake) {
            this.stake = stake; 
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};