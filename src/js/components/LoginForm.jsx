'use strict';

var LoginForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var email = React.findDOMNode(this.refs.usr).value.trim();
        var password = React.findDOMNode(this.refs.pwd).value.trim();
        if (!email || !password) {
            return
        }
        this.props.onSubmit(email, password);
        React.findDOMNode(this.refs.usr).value = '';
        React.findDOMNode(this.refs.pwd).value = '';
    },
    render: function () {
        return (
            <form className="login-form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">用户名</label>
                    <input className="form-control" type="text" id="email" ref="usr" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">密码</label>
                    <input className="form-control" type="password" id="password" ref="pwd" />
                </div>
                <button type="submit" class="btn btn-default">提交</button>
            </form>
        );
    }
});

var LoadingPage = React.createClass({

    render: function () {
        return (
            <div className="loading"></div>
        );
    }
});
