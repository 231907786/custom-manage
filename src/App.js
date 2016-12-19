import React, { Component } from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import './App.css';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger'
import rootReducer from './reducer'

import Login from './pages/login'
import NewCustomer from './pages/newCustomer'

const logger = createLogger({
  collapsed: true,
  // stateTransformer(state) {
  //   return Object.keys(state).reduce((acc, key) => {
  //     if (Immutable.Iterable.isIterable(state[key])) {
  //       acc[key] = state[key].toJS()
  //     }else {
  //       acc[key] = state[key]
  //     }
  //     return acc
  //   }, {})
  // },
  titleFormatter: ({type, key = ''}) => `action ${type}  ${key ? 'key:' : ''} ${key}`,
  diff: true,
})

// const store = createStore(rootReducer, applyMiddleware(
//     logger,
// ))
const store = createStore(rootReducer)

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={({children}) => <div className="router-root">{children}</div>}>
            <IndexRoute component={Login}></IndexRoute>
            <Route path="new-customer" component={NewCustomer}></Route>
          </Route>
        </Router>
      </Provider>
    )
  }
}
