import React from 'react'
import './index.css'
import AppBar from 'material-ui/AppBar'
import SelectCustomerAsync from '../../components/SelectCustomerAsync'
import SelectProductAsync from '../../components/SelectProductAsync'
import HeaderLine from '../../components/HeaderLine'
import IconButton from 'material-ui/IconButton'
import Add from 'material-ui/svg-icons/content/add'
import Remove from 'material-ui/svg-icons/content/remove'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Immutable from 'immutable'
import av from '../../db'
import {discountColors} from '../../config'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationDrawer from '../../components/NavigationDrawer'

export default class NewOrderRecord extends React.Component {

  state = {
    chosenDiscount: 100,
    list: Immutable.List(),
    submitPending: false,
  }

  chooseDiscount = discount => () => this.setState({chosenDiscount: discount})

  onSelectProduct = ({data}) => {
    const name = data.get('name')
    const id = data.get('product_id')
    const discount = this.state.chosenDiscount
    const value = data.get(String(discount))
    if (!value) return
    const product = Immutable.fromJS({
      name,
      id,
      discount,
      value,
      quantity: 1,
    })
    const exist = this.state.list.find((product) => product.get('id') === id && product.get('discount') === this.state.chosenDiscount)
    if (!exist) {
      this.setState({
        list: this.state.list.push(product)
      })
    }
  }

  getButtonProps = (discount) => {
    const initProps = [
      {
        label: '原价',
        discount: 100,
      },
      {
        label: '七折',
        discount: 70,
      },
      {
        label: '三折',
        discount: 30,
      },
    ]
    let index = -1
    initProps.some((item, i) => {
      if (item.discount === discount) {
        index = i
        return true
      }
      return false
    })
    initProps[index] = {
      ...initProps[index],
      backgroundColor: discountColors[discount],
      labelColor: '#fff',
    }
    return initProps
  }

  addQuantity = (product, i) => {
    this.setState({
      list: this.state.list.updateIn([i, 'quantity'], quantity => quantity + 1)
    })
  }

  subQuantity = (product, i) => {
    const quantity = this.state.list.getIn([i, 'quantity']) - 1
    if (quantity) {
      this.setState({
        list: this.state.list.setIn([i, 'quantity'], quantity)
      })
    }else {
      this.setState({
        list: this.state.list.delete(i)
      })
    }
  }

  getTotalPrice = () => this.state.list.reduce((acc, product) => acc + (product.getIn(['value', 'price']) * product.get('quantity')), 0)

  getTotalPV = () => this.state.list.reduce((acc, product) => acc + (product.getIn(['value', 'pv']) * product.get('quantity')), 0)

  getTotalQuantity = () => this.state.list.reduce((acc, product) => acc + product.get('quantity'), 0)

  resetList = (cb) => this.setState({list: Immutable.List()}, () => cb && cb())

  submit = () => {
    this.setState({submitPending: true})
    const customer = this.refs.customer.getCustomer()
    // 没有选中客户
    if (!customer) return
    const record = new av.Object('TransactionRecords')
    const productList = this.state.list.map(product => ({
      'product_id': product.get('id'),
      discount: product.get('discount'),
      quantity: product.get('quantity'),
    })).toJS()
    const totalPrice = this.getTotalPrice()
    record
      .set('type', 1)
      .set('sum_price', totalPrice)
      .set('sum_pv', this.getTotalPV())
      .set('product_list', productList)
    customer
      .add('transaction_records', record)
      .set('account_balance', customer.get('account_balance') - totalPrice)
      .save()
      .then(
        res => this.resetList(() => this.setState({submitPending: false})),
        err => this.setState({submitPending: false})
      )
  }

  render() {
    return (
      <div className="nor-root">
        <AppBar
          title="新增客户订单"
          iconElementLeft={<IconButton onTouchTap={() => this.refs.drawer.show()}><NavigationMenu /></IconButton>}
        />
        <SelectCustomerAsync
          ref="customer"
          className="customer-select"
        />
        <HeaderLine name="产品列表" className="product-list" />
        <div className="select-product">
          <div className="discount-buttons">
            {this.getButtonProps(this.state.chosenDiscount).map(props => {
              const discount = props.discount
              delete props.discount
              return (<RaisedButton key={discount} {...props} onTouchTap={this.chooseDiscount(discount)} />)
            })}
          </div>
          <SelectProductAsync
            discount={this.state.chosenDiscount}
            onChangeValue={this.onSelectProduct}
          />
        </div>
        <div className="list">
          {this.state.list.map((product, i) => (
            <div key={i} className="product">
              <div className="desc">
                <span className="sn" style={{color: discountColors[product.get('discount')]}}>{product.get('id')}</span>
                <span className="name">{product.get('name')}</span>
              </div>
              <div className="quantity">
                <IconButton className="remove" onTouchTap={() => this.subQuantity(product, i)}>
                  <Remove />
                </IconButton>
                <span>{product.get('quantity')}</span>
                <IconButton className="add" onTouchTap={() => this.addQuantity(product, i)}>
                  <Add />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <div className="total">
          <div className="value">
            <div className="price">总金额：<span>
              {this.getTotalPrice()}
            </span>元</div>
            <div className="pv">总积分：<span>
              {this.getTotalPV()}
            </span></div>
          </div>
          <FlatButton
            className="submit"
            label={`提交(${this.getTotalQuantity()})`}
            backgroundColor="#ee2650"
            labelStyle={{color: '#fff'}}
            disabled={!this.state.list.size || this.state.submitPending}
            onTouchTap={this.submit}
          />
        </div>
        <NavigationDrawer
          ref="drawer"
          router={this.props.router}
        />
      </div>
    )
  }
}
