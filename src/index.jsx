// Inject the global style references
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import routes from './routes';
import store from './config/store';
import { createHashHistory } from 'history';
require('./style/global.css');

const history = createHashHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(routes);
root.render(
  <Provider store={store}>
    <RouterProvider history={history} router={router} />
  </Provider>,
);