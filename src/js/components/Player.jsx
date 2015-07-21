'use strict';

var querystring = require('querystring');

class AudioPlayer extends React.Component {
    render() {
        var song = this.props.song;
        if (!song) {
            return null;
        }

        return (
            <div className="hidden">
                <audio id="audio-player"
                    src={song.url}
                    controls="true"
                    autoPlay="true"
                    ref="audio"
                    style={{display: 'none'}}
                />
            </div>
        );
    }

    componentDidMount() {
        var audioNode = React.findDOMNode(this.refs.audio);
        if (audioNode) {
            audioNode.addEventListener('ended', this.props.onNext);
            // audioNode.addEventListener('pause', this.props.onPause);
        }
    }

    componentWillUnmount() {
        var audioNode = React.findDOMNode(this.refs.audio);
        if (audioNode) {
            audioNode.removeEventListener('ended', this.props.onNext);
            // audioNode.removeEventListener('pause', this.props.onPause);
        }
    }
}

var songs = function songs(data) {
    var defer = $.Deferred();

    $.ajax({
        url: 'http://www.douban.com/j/app/radio/people?' + querystring.stringify(data),
        method: 'GET',
        dataType: 'json'
    }).then(function (response) {
        if (response.r === 0) { // 调用成功
            defer.resolve(response);
        } else {
            defer.reject(response.err);
        }
    }).fail(defer.reject);

    return defer.promise();
};

var Player = React.createClass({
    getInitialState: function () {
        return {
            index: 0,
            length: 0,
            songs: []
        }
    },

    // 插入真实的DOM以后调用
    componentDidMount: function() {
        this.refresh();
    },

    componentDidUpdate: function () {
        var song = this.state.songs[this.state.index];
        if (!song) {
            return;
        }
        var className = song.like === 1 ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty";
        React.findDOMNode(this.refs.like).className =  className;
    },

    render: function () {
        var index = this.state.index,
            song = this.state.songs[index];

        // TODO: 支持audio自动播放下一曲
        if (!song) return null;
        return (
            <div className="player">
                <AudioPlayer song={song} onNext={this.next} />

                <img className="album-img animate" src={song.picture} alt={song.title} ref="album"></img>
                <div className="wrapper">
                    <div className="container">
                        <h2 className="text-center">
                            <a target="_blank"
                                href={"http://music.douban.com/" + song.album}>{song && song.title}
                            </a>
                        </h2>

                        <p className="text-center"><strong>{song.artist}</strong></p>
                        <br />
                        <div className="wrap">
                            <div className="controller text-center">
                                <span ref="like"
                                    title={(song.like === 1) ? "移除收藏" : "添加收藏"}
                                    className={(song.like === 1) ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty"}
                                    onClick={this.like}>
                                </span>
                                <span ref='trash'
                                    className="glyphicon glyphicon-trash"
                                    title="不再播放"
                                    onClick={this.trash}>
                                </span>
                                <span ref='pause'
                                    title="暂停/播放"
                                    className="glyphicon glyphicon-pause"
                                    onClick={this.pause}>
                                </span>
                                <span ref='next'
                                    title="下一曲"
                                    className="glyphicon glyphicon-step-forward"
                                    onClick={this.next}>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    },

    like: function () {
        var song = this.state.songs[this.state.index],
            type = song.like === 1 ? 'u' : 'r';

        var me = this;

        var isLike = 1 - me.state.songs[me.state.index].like;
        me.state.songs[me.state.index].like = isLike;

        React.findDOMNode(this.refs.like).className =
            isLike === 1 ? "glyphicon glyphicon-heart"
            : "glyphicon glyphicon-heart-empty";

        songs({
            app_name: 'radio_desktop_win',
            version: 100,
            type: type,
            sid: song.sid,
            user_id: this.props.id,
            expire: this.props.expire,
            token: this.props.token,
            channel: 1
        }).then(function (response) {
            // 红心 / 取消红心
            console.log('红心设置成功');
        }, function (err) {
            alert(err);
        });
    },
    trash: function () {
        var me = this;
        var song = this.state.songs[this.state.index];

        songs({
            app_name: 'radio_desktop_win',
            version: 100,
            type: 'b',
            sid: song.sid,
            user_id: this.props.id,
            expire: this.props.expire,
            token: this.props.token,
            channel: 1
        }).then(function (response) {
            me.next();
        }, function (err) {
            alert(err);
        });
    },
    refresh: function () {
        var me = this;
        var data = {
            app_name: 'radio_desktop_win',
            version: 100,
            type: 'n',
            user_id: this.props.id,
            expire: this.props.expire,
            token: this.props.token,
            channel: 1     // 红心频道
        };
        $.ajax({
            url: 'http://www.douban.com/j/app/radio/people?' + querystring.stringify(data),
            method: 'GET',
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            me.setState({
                index: 0,
                length: response.song.length,
                songs: response.song
            });
        });
    },
    next: function () {
        var index = this.state.index;
        index += 1;
        if (index === this.state.length) {
            this.refresh();
        } else {
            this.setState({
                index: index
            });
        }
    },
    prev: function () {
        var index = this.state.index;
        index -= 1;
        if (index === -1) {
            this.refresh();
        } else {
            this.setState({
                index: index
            });
        }
    },
    pause: function (evt) {
        var node = document.getElementById('audio-player');
        var target = evt.target;
        if (node.paused) {
            this.play(evt, node);
        } else {
            node.pause();
            target.className = 'glyphicon glyphicon-play';
            React.findDOMNode(this.refs.album).className = 'album-img';
        }
    },
    play: function (evt, node) {
        if (!node) {
            node = document.getElementById('audio-player');
        }
        node.play();
        React.findDOMNode(this.refs.pause).className = 'glyphicon glyphicon-pause';
        React.findDOMNode(this.refs.album).className = 'album-img animate';
    },
    album: function () {
    }
});
