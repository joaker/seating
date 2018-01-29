// Inject the global style references
require('./style/global.css');


import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {Provider} from 'react-redux';

import routes from './routes';
import store from './config/store';




ReactDOM.render(
  <Provider store={store}>
    <Router  history={hashHistory} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
