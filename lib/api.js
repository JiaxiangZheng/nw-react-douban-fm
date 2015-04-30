var http = require('http'),
    querystring = require('querystring'),
    _ = require('lodash'),
    fs = require('fs');

// NOTE: 
// 1. path 一定要写绝对路径，而非相对路径，即以 '/' 开关
// 2. headers不要搞错
var default_option = {
    hostname: 'www.douban.com',
    path: '/',
    headers: {
        'User-Agent': 'douban.fm'
    }
};

// TODO: refactor to make it more robust
// a private method for handling the http request response
var _callback = function (handle) {
    return function (res) {
        // TODO: determin res.statusCode
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            var response = Buffer.concat(chunks).toString('utf8')
            handle(response);
        });
    };
}

var auth = function auth(email, password) {
    return new Promise(function (resolve, reject) {
        var data = querystring.stringify({
            app_name: 'radio_desktop_win',
            version: 100,
            email: email,
            password: password 
        });

        var option = _.extend(_.clone(default_option, true), {
            path: '/j/app/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length,
                'User-Agent': 'douban.fm'
            }
        });

        var request = http.request(option, _callback(function (response) {
            response = JSON.parse(response);
            if (response.r === 0) {
                resolve(response);
            } else {
                reject(new Error(response.err));
            }
        }))
            .on('error', function (err) {
                reject(err);
            });

        request.write(data);
        request.end();
    });
};

var channels = function channels() {
    return new Promise(function (resolve, reject) {
        var option = _.extend(_.clone(default_option, true), {
            path: '/j/app/radio/channels'
        });
        console.log(option)
        http.get(option, _callback(function (response) {
            try {
                response = JSON.parse(response);
                resolve(response);
            } catch (e) {
                reject(e);
            }
        })).on('error', function (err) {
            reject(err);
        });
    });
}

var songs = function songs(info) {
    return new Promise(function (resolve, reject) {
        var data = _.extend({
                app_name: 'radio_desktop_win',
                version: 100,
                type: 'n',
                channel: 1
            }, info);

        console.log(data);

        var option = _.extend(_.clone(default_option, true), {
            path: '/j/app/radio/people?' + querystring.stringify(data)
        });

        http.get(option, _callback(function (response) {
            try {
                resolve(JSON.parse(response))
            } catch (e) {
                reject(e);
            }
        })).on('error', reject);
    });
}

var download = function (url, title) {
    return new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            res.pipe(fs.createWriteStream(title)).on('finish', resolve).on('error', reject);
        }).on('error', reject);
    });
}

// FIXME: if the info.sid or token/expire/user_id info is missing, reject it
var rate = function rate(info, like) {
    like = (like !== undefined) ? like : true;
    return songs(_.extend({
        type: like ? 'r' : 'u'
    }, info));
}

var unrate = function unrete(info) {
    return rate(info, false);
}

module.exports = {
    auth: auth,
    channels: channels,
    songs: songs,
    download: download,
    rate: rate,
    unrate: unrate
}
