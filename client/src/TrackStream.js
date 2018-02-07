const inherits = require('inherits');
const stream = require('readable-stream');
const processNextTick = require('process-nextick-args');

class TrackStream {
    constructor(buffer) {
        stream.Readable.call(this);
        this._buffer = buffer;
        this._lenght = buffer.byteLength;
        this._readed = 0;
    }
}

inherits(TrackStream, stream.Readable);

TrackStream.prototype._read = function (n) {
    n = parseInt(n, 10);
    n = Math.min(n, this._lenght - this._readed);

    if (n !== 0) {
        process.nextTick(function () {
            this.push(this._buffer.slice(this._readed, this._readed + n));
            this._readed += n;
        }.bind(this))
    }

    if (n === 0) {
        process.nextTick(function () {
            this.emit('end')
        }.bind(this))
    }
};

module.exports = TrackStream;