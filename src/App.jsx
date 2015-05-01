/** @jsx React.DOM */
var _ = require('lodash');

// var Player = require('./src/Player.jsx'),
//     LoginForm = require('./src/LoginForm.jsx');

var App = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    login: function (email, password) {
        var me = this;
        $.ajax({
            url: 'http://www.douban.com/j/app/login',
            type: 'POST',
            data: {
                app_name: 'radio_desktop_win',
                version: 100,
                email: email,
                password: password 
            },
            dataType: 'json'
        }).then(function (response) {
            var defer = $.Deferred()
            if (!response || response.r !== 0) {
                var err = response ? response.err : "unable to get the auth data";
                defer.reject(new Error(err));
            } else {
                defer.resolve(response)
            }
            return defer.promise();
        }).then(function (user_info) {
            me.setState({
                email: email,
                password: password,
                token: user_info.token,
                id: user_info.user_id,
                expire: user_info.expire,
                username: user_info.user_name
            });
            localStorage.setItem('userInfo', JSON.stringify(me.state));
        }, function (err) {
            alert(err);
        });
    },

    componentDidMount: function() {
        var user = JSON.parse(localStorage.getItem('userInfo'));
        if (user && user.email && user.password) {
            this.login('jiaxiang.zheng135@gmail.com', 'ZhengJX135@DOUBAN');
        }
    },

    render: function () {
        return (
            <div className="db-app">
                <h3>{this.props.title}</h3>
                {
                    !(this.state.email && this.state.password) ? (
                        <LoginForm onSubmit={this.login}/>
                    ) : <Player {...{
                            email: this.state.email,
                            password: this.state.password,
                            token: this.state.token,
                            id: this.state.id,
                            expire: this.state.expire,
                            username: this.state.username
                        }}/>
                }
            </div>
        )
    }
});