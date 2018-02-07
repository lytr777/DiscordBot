const fs = require('fs');

class Downloader {

    constructor() {
        this.downloading = {};
        this.downloaded = {}
    }

    download(trackInfo, streamBuilder, callback) {
        if (this.downloaded[trackInfo.path]) {
            callback(null, null, trackInfo);
            return
        }

        let fd = this.downloading[trackInfo.path];
        if (fd) {
            fd.on('finish', () => this.finish(null, trackInfo, callback))
        } else {
            let stream = streamBuilder();
            fd = fs.createWriteStream(trackInfo.path);
            stream.on('error', function (err) {
                console.log('Downloader error: ' + err);
                this.downloading[trackInfo.path] = null
            }.bind(this));
            stream.on('end', function () {
                console.log('Downloader stream end: ' + trackInfo);
                this.downloading[trackInfo.path] = null;
                this.downloaded[trackInfo.path] = trackInfo
            }.bind(this));
            fd.on('finish', () => this.finish(trackInfo, trackInfo,  callback));
            stream.pipe(fd);
            this.downloading[trackInfo.path] = fd
        }
    }

    finish(first, all, callback) {
        console.log('Downloader finish: ' + all.name);
        if (this.downloaded[all.path]) {
            callback(null, first, all)
        } else {
            callback(new Error('Error while downloading'))
        }
    }
}

const downloader = new Downloader();

module.exports = downloader;