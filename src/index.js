import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'normalize.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin(
  // {
  //   shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
  //     return true;
  //   }
  // }
);

ReactDOM.render(
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
