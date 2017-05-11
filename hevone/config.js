const pjson = require('./package.json');

let config = {};

config.version = pjson.version;
config.dataDir = 'data';
config.apikey = 'INSERT-API-TOKEN-HERE';

module.exports = config;
