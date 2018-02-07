import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

//Routable Components
import App from './components/App';
import Main from './components/Main';
import Venue from './components/Venue';
import GenerateGuests from './components/GenerateGuests';
import Children from './components/pure/Children';
import VenueMenu from './components/menus/VenueMenu';

const routes = (
    <Route path="/" component={App} title="Home">
      <IndexRoute to="/" component={Main}/>
      <Route path="Landing" title="Seatable" components={{fullscreen:Main}}></Route>
      <Route path="Venue" title="Venue" >
        <IndexRoute to="/Venue" components={{children:Venue, menu:VenueMenu}}></IndexRoute>
        <Route path="GenerateGuests" title="Generate Guests" component={GenerateGuests}></Route>
        <Route path="Seating" title="Venue Seating" components={{children:Venue, menu:VenueMenu}}></Route>
      </Route>
    </Route>
);

export default routes;
