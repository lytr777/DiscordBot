const util = require('util');

function DatabaseError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, DatabaseError);

    this.message = message;
}

util.inherits(DatabaseError, Error);
DatabaseError.prototype.name = 'DatabaseError';
exports.DatabaseError = DatabaseError;