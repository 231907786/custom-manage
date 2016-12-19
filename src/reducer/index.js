import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

export default combineReducers({
  hehe: (state = {}) => state,
  form: formReducer,
})
