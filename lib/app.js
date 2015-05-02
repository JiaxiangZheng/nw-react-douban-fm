var _ = require('lodash')
var api = require('./lib/api')

var user;

if (process.argv.length < 4) {
    console.log('usage: iojs app.js email password')
    return
}

api.auth(process.argv[2], process.argv[3])
    .then(function (info) {
        user = {
            user_id: info.user_id,
            expire: info.expire,
            token: info.token,
            channel: -3     // 红心频道
        };
        return api.songs(user);
    })
    .then(function (_songs) {
        console.log(_songs)
        _songs = _songs.song.map(function (song) {
            return {
                title: song.title,
                url: song.url,
                sid: song.sid
            }
        });
        return Promise.all(_songs.map(function (song, index) {
            console.time(index)
            return api.download(song.url, song.title + '.mp3').then(function (data) {
                console.log('finished downloading', song.title);
                console.timeEnd(index)
            });
        }));
    })
    .then(function () {
        console.log('all data has been downloaded');
    })
    .catch(console.error);
