import React from 'react'
import './index.css'
import av from '../../db'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Form from './newCustomerForm'
import AppBar from 'material-ui/AppBar'

export default class NewCustomer extends React.Component {

  state = {

  }


  alert = (type, msg) => {
    Alert[type](`<p class="prompt">${msg}</p>`, {
      effect: 'stackslide',
      timeout: 5000,
    })
  }


  render() {
    return (
      <div className="nc-root">
        <AppBar
          title="新增客户"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Form onSubmit={async(values, dispatch, form) => {
          form.reset()
          // const Customer = av.Object.extend('Customer')
          // const customer = new Customer()
          // return Object.keys(values).reduce((acc, key) => acc.set(key, values[key]), customer)
          //   .save()
          //   .then(
          //     res => console.log(res),
          //     err => console.error(err)
          //   )
        }} />
        <Alert
          stack={{limit: 3}}
          html
          position="top"
        />
      </div>
    )
  }
}
