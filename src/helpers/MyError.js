class MyError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode,
        this.code = code
    }
}

module.exports = { MyError }