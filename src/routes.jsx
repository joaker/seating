import React from 'react';
import App from './components/App';
import Venue from './components/Venue';
import GenerateGuests from './components/GenerateGuests';
import VenueMenu from './components/menus/VenueMenu';
import { Navigate } from "react-router-dom";

const routes = ([
  {
    path: "/",
    element: (
      <App children={<Venue />} />
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
    element: <Navigate to="/" replace />,
  },
]);

export default routes;