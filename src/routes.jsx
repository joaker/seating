import React from 'react';
import App from './components/App';
import Venue from './components/Venue';
import GenerateGuests from './components/GenerateGuests';
import VenueMenu from './components/menus/VenueMenu';

import {
  Route,
} from "react-router-dom";

const routes = ([
  {
    path: "/",
    element: (
      <App menu={<VenueMenu />} children={<Venue />} />
    ),
  },
  {
    path: "generate-guests",
    element: (
      <App children={<GenerateGuests />} />
    )
  },
  {
    path: "seating",
    element: (
      <App menu={<VenueMenu />} children={<Venue />} />
    )
  },
]);

export default routes;