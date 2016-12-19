import React, {Component} from 'react'
import { reduxForm, Field } from 'redux-form'
import RadioButton from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton'
import {
  TextField,
  RadioButtonGroup,
} from 'redux-form-material-ui'
import HeaderLine from '../../components/HeaderLine'
import av from '../../db'

class NewCustomerForm extends Component {

  required = (promptText = '必填项') => val => !!val ? '' : promptText

  numberNormalizer = (val, preVal) => {
    if (isNaN(+val)) return preVal
    return +val
  }

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props
    return (
      <form onSubmit={handleSubmit}>
        <HeaderLine name="基本信息">
          <Field
            name="name"
            component={TextField}
            hintText="姓名"
            floatingLabelText="姓名"
            validate={this.required()}
            style={{
              top: '-14px'
            }}
          />
          <Field
            name="id_number"
            component={TextField}
            hintText="身份证号码"
            floatingLabelText="身份证号码"
            validate={this.required()}
            style={{
              top: '-34px'
            }}
          />
          {/* <Field
            name="id_number"
            component={TextField}
            hintText="身份证号码"
            floatingLabelText="身份证号码"
            validate={this.required()}
            style={{
              top: '-55px'
            }}
          />
          <Field
            name="id_number"
            component={TextField}
            hintText="身份证号码"
            floatingLabelText="身份证号码"
            validate={this.required()}
            style={{
              top: '-75px'
            }}
          /> */}
        </HeaderLine>
        <HeaderLine name="联系方式" style={{marginTop: '-20px'}}>
          <Field
            name="mobile_number"
            component={TextField}
            hintText="手机号码"
            floatingLabelText="手机号码"
            validate={this.required()}
            style={{
              top: '-14px'
            }}
          />
          <Field
            name="address"
            component={TextField}
            hintText="地址"
            floatingLabelText="地址"
            style={{
              top: '-34px'
            }}
          />
        </HeaderLine>
        <HeaderLine name="会员信息" style={{marginTop: '-20px'}}>
          <Field
            name="sn"
            component={TextField}
            hintText="会员编号"
            floatingLabelText="会员编号"
            validate={this.required()}
            style={{
              top: '-14px'
            }}
          />
          <Field
            name="grade"
            component={RadioButtonGroup}
            className="grade"
            parse={val => +val}
            format={val => String(val)}
          >
            <RadioButton value="500" label="特惠" style={{marginTop: '0px'}}/>
            <RadioButton value="10000" label="特聘" style={{marginTop: '0px'}}/>
          </Field>
          <Field
            name="account_balance"
            component={TextField}
            hintText="报单金额"
            floatingLabelText="报单金额"
            validate={this.required()}
            style={{
              top: '-10px'
            }}
            normalize={this.numberNormalizer}
          />
        </HeaderLine>
        <div className="buttonWrap">
          <RaisedButton
            label="确认新增"
            primary
            type="submit"
            disabled={pristine || submitting}
          />
        </div>
      </form>
    )
  }
}


NewCustomerForm = reduxForm({
  form: 'newCustomerForm',
})(NewCustomerForm)

export default NewCustomerForm
