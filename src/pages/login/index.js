import React from 'react'
import './index.css'
import av from '../../db'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

export default class Login extends React.Component {

  state = {
    focus: '',
    username: '',
    password: '',
  }

  onSubmit = e => {
    const {username, password} = this.state
    e.preventDefault()
    av.User.logIn(username, password)
      .then(
        success => this.props.router.push('new-customer'),
        fail => this.alert('error', '账号不存在或密码错误')
      )
  }

  alert(type, msg) {
    Alert[type](`<p class="prompt">${msg}</p>`, {
      effect: 'stackslide',
      timeout: 5000,
    })
  }

  render() {
    return (
      <div className="login-root">
        <form className="form" onSubmit={this.onSubmit}>
          <div className={`row ${this.state.focus === 'username' ? 'focus' : ''}`}>
            <label htmlFor="username">账号</label>
            <input
              autoFocus
              id="username"
              type="text"
              onFocus={() => this.setState({focus: 'username'})}
              onBlur={() => this.setState({focus: ''})}
              onChange={e => this.setState({username: e.target.value})}
              value={this.state.username}
            />
          </div>
          <div className={`row ${this.state.focus === 'password' ? 'focus' : ''}`}>
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              onFocus={() => this.setState({focus: 'password'})}
              onBlur={() => this.setState({focus: ''})}
              onChange={e => this.setState({password: e.target.value})}
              value={this.state.password}
            />
          </div>
          <div className="submit">
            <input type="submit" value="登录"/>
          </div>
        </form>
        <Alert
          stack={{limit: 3}}
          html
          position="top"
        />
      </div>
    )
  }
}
