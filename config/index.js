const nConf = require('nconf');
const path = require('path');

nConf.argv()
    .env()
    .file({file: path.join(__dirname, 'config.json')});

module.exports = nConf;