/** @jsx React.DOM */

// <LoginForm onSubmit={this.login}/>
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
                <label htmlFor="email">用户名</label>
                <input type="text" id="email" ref="usr" />
                <br />
                <label htmlFor="password">密码</label>
                <input type="password" id="password" ref="pwd" />
                <br />
                <input type="submit" value="提交" />
            </form>
        );
    }
});
