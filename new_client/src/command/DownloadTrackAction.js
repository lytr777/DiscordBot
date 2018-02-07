const ytdl = require('ytdl-core');
const HashedTrack = require('../../../models/HashedTrack').HashedTrack;

const Downloader = require('../util/Downloader');
const ChatAction = require('./ChatAction');
const AddTrackAction = require('./AddTrackAction');
const Dictionary = require('../util/Dictionary').Rus;

const collectionDirectory = '/var/cache/Bot/collection/';
// const collectionDirectory = '/Users/lytr777/'
const timeLimit = 600;

class DownloadTrackAction {

    constructor(link) {
        this.link = link;
        this.type = 'callback'
    }

    start(guild, callback) {
        ytdl.getInfo(this.link)
            .then(function (info) {
                if (info.length_seconds < timeLimit) {
                    this.download(info, callback)
                } else {
                    callback([new ChatAction(Dictionary['too_long']())])
                }
            }.bind(this))
            .catch(function (err) {
                console.log(err.message);
                callback([new ChatAction(Dictionary['yt_error'](this.link))])
            }.bind(this));
    }

    download(info, callback) {
        let id = info.vid || info.video_id;
        HashedTrack.getTrackById(id, function (err, track) {
            let id = info.vid || info.video_id;
            let trackInfo = {
                id: id,
                path: collectionDirectory + id,
                name: info.title,
                duration: info.length_seconds
            };
            if (err) {
                console.log("download vid: " + id);
                callback([new ChatAction(Dictionary['start_download'](info.title))]);
                let streamBuilder = function () {
                    return ytdl.downloadFromInfo(info, {quality: 'lowest', filter: 'audioonly'})
                };
                Downloader.download(trackInfo, streamBuilder, function (err, first, all) {
                    if (err) {
                        callback([new ChatAction(Dictionary['download_error'](all.name))]);
                    } else {
                        if (first) {
                            HashedTrack.addTrack(first, (err, track) => {
                                if (err) {
                                    console.log(err.message);
                                    callback([new ChatAction(Dictionary['save_error'](track.name))])
                                } else {
                                    callback([new AddTrackAction(trackInfo)])
                                }
                            })
                        } else {
                            callback([
                                new ChatAction(Dictionary['already_download'](all.name)),
                                new AddTrackAction(trackInfo)
                            ])
                        }
                    }
                })
            } else {
                callback([
                    new ChatAction(Dictionary['already_download'](track.name)),
                    new AddTrackAction(trackInfo)
                ])
            }
        })
    }
}

module.exports = DownloadTrackAction;