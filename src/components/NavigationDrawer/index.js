import React from 'react'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import './index.css'

export default class NavigationDrawer extends React.Component {

  state = {
    open: false,
    items: [
      {
        text: '新增客户',
        link: 'new-customer'
      },
      {
        text: '新增客户订单',
        link: 'new-order-record'
      },
      {
        text: '客户历史订单',
        link: 'order-list'
      },
    ]
  }

  show = () => this.setState({open: true})
  hide = () => this.setState({open: false})

  render() {
    const {width, router} = this.props
    const {push, routes} = router
    return (
      <Drawer
        docked={false}
        width={width || 200}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
      >
        {this.state.items.map(({text, link}, i) => {
          const active = routes[routes.length - 1].path === link
          return (
            <MenuItem
              key={i}
              onTouchTap={() => active ? this.hide() : push(link)}
              className={active ? 'drawer-item-active' : ''}
            >{text}</MenuItem>
          )
        })}
      </Drawer>
    )
  }
}
