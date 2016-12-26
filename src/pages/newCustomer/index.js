import React from 'react'
import './index.css'
import av from '../../db'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Form from './newCustomerForm'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationDrawer from '../../components/NavigationDrawer'

export default class NewCustomer extends React.Component {

  alert = (type, msg) => {
    Alert[type](`<p class="prompt">${msg}</p>`, {
      effect: 'stackslide',
      timeout: 3000,
    })
  }

  render() {
    return (
      <div className="nc-root">
        <AppBar
          title="新增客户"
          iconElementLeft={<IconButton onTouchTap={() => this.refs.drawer.show()}><NavigationMenu /></IconButton>}
        />
        <Form onSubmit={async(values, dispatch, form) => {
          const customer = new av.Object('Customer')
          return Object.keys(values).reduce((acc, key) => acc.set(key, values[key]), customer)
            .save()
            .then(
              res => {
                this.alert('info', '新增成功')
                form.reset()
              },
              err => {
                const codeMap = {
                  '-1': '网络连接断开，请检查网络',
                  137: '会员编号已存在',
                }
                this.alert('error', codeMap[String(err.code)])
              }
            )
        }} />
        <Alert
          stack={{limit: 3}}
          html
          position="top"
          offset={64}
        />
        <NavigationDrawer
          ref="drawer"
          router={this.props.router}
        />
      </div>
    )
  }
}
