const youtube = ['https://www.youtube.com/watch?v=', 'https://youtu.be/'];

class LinkChecker {

    static checkYoutube(link) {
        return youtube.some((pattern) => link.startsWith(pattern))
    }
}

module.exports = LinkChecker;

