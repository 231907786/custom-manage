import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import _ from 'lodash'
import av from '../../db'

export default class SelectCustomerAsync extends React.Component {

  state = {
    value: null,
    customer: null,
  }

  getCustomer = () => this.state.customer

  lastTimeLoadCustomer = {
    input: '',
    result: null,
  }

  onChangeValue = (value) => {
    if (!value) return this.setState({value: null, customer: null})
    this.setState({value: value.value, customer: value.customer})
  }

  loadCustomer = _.throttle((input) => {
    const nameQuery = new av.Query('Customer')
    nameQuery.contains('name', input)
    const snQuery = new av.Query('Customer')
    snQuery.contains('sn', input)
    return av.Query.or(nameQuery, snQuery)
      // .select(['name', 'sn', 'account_balance'])
      .find()
      .then(result => ({
        options: result.map(customer => ({
          value: `${customer.get('name')} ${customer.get('sn')}`,
          customer,
          // label: `${user.get('name')} ${user.get('sn')}`,
        }))
      }))
  }, 2000)

  loadOptions = (input) => {
    input = input.trim()
    if (!input) return Promise.resolve({options: []})
    const cache = this.checkCache(input)
    if (cache) return Promise.resolve(cache)
    return this.loadCustomer(input).then(result => {
      this.saveCache(input, result)
      return result
    })
  }

  checkCache = (input) => {
    const last = this.lastTimeLoadCustomer
    // 缓存输入框退格结果,不查询服务器
    if (last.input.length - input.length === 1) {
      return last.result
    }else {
      return null
    }
  }

  saveCache = (input, result) => {
    const last = this.lastTimeLoadCustomer
    last.input = input
    last.result = result
  }

  render() {
    return (
      <Select.Async
        className={this.props.className}
        value={this.state.value}
        onChange={this.onChangeValue}
        loadOptions={this.loadOptions}
        labelKey="value"
        noResultsText="没有匹配的结果"
        onBlurResetsInput={true}
        onCloseResetsInput={true}
        placeholder="选择客户"
        searchPromptText="输入客户编号或姓名搜索"
      />
    )
  }
}
