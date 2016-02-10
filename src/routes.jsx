import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

//Routable Components
import App from './components/App';
import Main from './components/Main';
import Guests from './components/Guests';
import Guest from './components/Guest';
import Table from './components/Table';
import SeatGuest from './components/SeatGuest';

const routes = (
    <Route path="/" component={App} title="Home">
      <IndexRoute to="/" component={Main} title="Main"/>
      <Route path="Guests" title="Guests">
        <IndexRoute to="/Guests" component={Guests} title="Guest List"/>
        <Route path=":id" component={Guest} title="Guest"></Route>
      </Route>
      <Route path="Table" title="Table">
        <IndexRoute to="/Table" title="Arrange" component={Table}></IndexRoute>
        <Route path=":id" title="Seat Guest" component={SeatGuest}></Route>
      </Route>
    </Route>
);

export default routes;
