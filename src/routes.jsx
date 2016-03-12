import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

//Routable Components
import App from './components/App';
//import Landing from './components/Landing';
import Main from './components/Main';
import Guests from './components/Guests';
import Guest from './components/Guest';
import Table from './components/Table';
import SeatGuest from './components/SeatGuest';
import Venue from './components/Venue';
import GenerateGuests from './components/GenerateGuests';
import Children from './components/pure/Children';
import VenueMenu from './components/menus/VenueMenu';

const routes = (
    <Route path="/" component={App} title="Home">
      <IndexRoute to="/" component={Main}/>
      <Route path="Landing" title="Seatable" components={{fullscreen:Main}}>
      </Route>
      <Route path="Guests" title="Guests">
        <IndexRoute to="/Guests" component={Guests}/>
        <Route path=":id" component={Guest} title="Guest"></Route>
      </Route>
      <Route path="Table" title="Table">
        <IndexRoute to="/Table" component={Table}></IndexRoute>
        <Route path=":id" title="Seat Guest" component={SeatGuest}></Route>
      </Route>
      <Route path="Venue" title="Venue" >
        <IndexRoute to="/Venue" components={{children:Venue, menu:VenueMenu}}></IndexRoute>
        <Route path="GenerateGuests" title="Generate Guests" component={GenerateGuests}></Route>
      </Route>
    </Route>
);

export default routes;
