class Formatter {

    static formatTime(time) {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        return min + ':' + (sec > 9 ? '' : '0') + sec;
    }
}

module.exports = Formatter;