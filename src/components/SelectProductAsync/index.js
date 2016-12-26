import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import _ from 'lodash'
import av from '../../db'

export default class SelectProductAsync extends React.Component {

  state = {
    value: null
  }

  lastTimeLoadCustomer = {
    input: '',
    result: null,
  }

  loadCustomer = _.throttle((input) => {
    const nameQuery = new av.Query('ProductPrice')
    nameQuery.contains('name', input)
    const idQuery = new av.Query('ProductPrice')
    idQuery.contains('product_id', input)
    return av.Query
      .or(nameQuery, idQuery)
      .exists(String(this.props.discount))
      .find()
      .then(result => ({
        options: result.map(user => ({
          value: `${user.get('product_id')} ${user.get('name')}`,
          data: user,
        }))
      }))
  }, 2000)

  loadOptions = (input) => {
    input = input.trim().toUpperCase()
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
        onChange={this.props.onChangeValue}
        loadOptions={this.loadOptions}
        labelKey="value"
        noResultsText="没有匹配的结果"
        onBlurResetsInput={true}
        onCloseResetsInput={true}
        placeholder="添加产品"
        searchPromptText="输入产品编号或名称搜索"
        cache={false}
      />
    )
  }
}
