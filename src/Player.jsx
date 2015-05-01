/** @jsx React.DOM */
var querystring = require('querystring');

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
}


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
        this.play();
    },

    render: function () {
        var index = this.state.index,
            song = this.state.songs[index];
        
        // TODO: 支持audio自动播放下一曲
        return (
            <div className="player">
                <audio id="audio-player" src={song ? song.url : ''} controls="true" autoplay="true" style={{display: 'none'}}/>

                <img className="album-img" src={song ? song.picture : ''} alt={song ? song.title : ''}></img>
                <div className="wrapper">
                    <div className="container">
                        <h2 className="text-center">
                            <a target="_blank" href={song && song.album ? "http://music.douban.com/" + song.album : "" }>{song && song.title}</a>
                        </h2>
                        
                        <p className="text-center"><strong>{song && song.artist}</strong></p>
                        <br />
                        <div className="wrap">
                            <div className="controller text-center">
                                <span id='ctrl-like' className={(song && song.like === 1) ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty"} 
                                    onClick={this.like}></span>
                                <span id='ctrl-trash' className="glyphicon glyphicon-trash"></span>
                                <span id='ctrl-pause' className="glyphicon glyphicon-pause" onClick={this.pause}></span>
                                <span className="glyphicon glyphicon-step-forward" onClick={this.next}></span>
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
        $('#ctrl-like')[0].className = isLike === 1 ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty";

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
        }
    },
    play: function (evt, node) {
        if (!node) {
            node = document.getElementById('audio-player');
        }
        if (!evt) {
            evt = {
                target: document.getElementById('ctrl-pause')
            };
        }
        node.play();
        evt.target.className = 'glyphicon glyphicon-pause';
    },
    album: function () {
    }
});