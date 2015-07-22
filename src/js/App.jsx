'use strict';

import React from 'react'
import Player from './components/Player';
import LoginForm from './components/LoginForm';

var App = React.createClass({
    getInitialState: function () {
        return {
            loading: true
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
                username: user_info.user_name,
                loading: false
            });
            localStorage.setItem('userInfo', JSON.stringify(me.state));
        }, function (err) {
            alert(err);
        });
    },

    componentDidMount: function() {
        var user = JSON.parse(localStorage.getItem('userInfo'));
        if (user && user.email && user.password) {
            this.setState({
                email: user.email,
                password: user.password,
                loading: true
            });
            this.login(user.email, user.password);
        }
    },

    render: function () {
        var page = null;

        if (!this.state.email || !this.state.password) { // 显示登陆页面
            page = <LoginForm onSubmit={this.login} />;
        } else if (this.state.loading) {    // 显示正在加载
            page = <div>努力登录中。。。</div>
        } else {    // 显示播放页
            page = <Player {...{
                    email: this.state.email,
                    password: this.state.password,
                    token: this.state.token,
                    id: this.state.id,
                    expire: this.state.expire,
                    username: this.state.username
                }}/>;
        }
        return (
            <div className="db-app">
                {page}
            </div>
        )
    }
});

React.render(<App title={"豆瓣电台"} />, document.getElementById('main'));
