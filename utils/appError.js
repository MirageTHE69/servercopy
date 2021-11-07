module.exports = class {
    constructor(message, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
    }
};