import React from 'react'
import moment from 'moment'
import SelectCustomerAsync from '../../components/SelectCustomerAsync'
import HeaderLine from '../../components/HeaderLine'
import FlatButton from 'material-ui/FlatButton'
import './index.css'
import av from '../../db'
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationDrawer from '../../components/NavigationDrawer'

export default class OrderList extends React.Component {

  state = {
    list: [],
  }

  query = () => {
    const customer = this.refs.customer.getCustomer()
    if (!customer) return
    const objectId = customer.get('objectId')
    const customerQuery = new av.Query('Customer')
    customerQuery
      .equalTo('objectId', objectId)
      .include(['transaction_records'])
      .find()
      .then(
        res => this.setState({
          list: res[0].get('transaction_records').sort(
            (a, b) => a.get('createdAt') > b.get('createdAt') ? -1 : 1
          ).map(record => ({
            sum_price: record.get('sum_price'),
            sum_pv: record.get('sum_pv'),
            sum_quantity: record.get('product_list').reduce((acc, product) => acc + product.quantity, 0),
            type: record.get('type'),
            date: moment(record.get('createdAt')).format('YYYY年MM月DD日')
          }))
        }),
        err => console.error(err.code)
      )
  }

  render() {
    return (
      <div className="ol-root">
        <AppBar
          title="客户历史订单"
          iconElementLeft={<IconButton onTouchTap={() => this.refs.drawer.show()}><NavigationMenu /></IconButton>}
        />
        <div className="select-query">
          <SelectCustomerAsync
            ref="customer"
            className="customer-select"
          />
          <button className="query" onTouchTap={this.query}>查询</button>
        </div>
        <div className="list">
          {this.state.list.map((record, i) => (
            <div key={i} className="record">
              <div className="type-quantity">
                <span>{`${record.type === 1 ? '领取' : '付款'}(${record['sum_quantity']})`}</span>
              </div>
              <div className="sum">
                共计：
                <div>
                  <span>{record['sum_price']}元</span>
                  <span>{record['sum_pv']}PV</span>
                </div>
              </div>
              <div className="date">{record.date}</div>
            </div>
          ))}
        </div>
        <NavigationDrawer
          ref="drawer"
          router={this.props.router}
        />
      </div>
    )
  }
}
