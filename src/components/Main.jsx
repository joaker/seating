import React from 'react';
import { Link } from 'react-router'

const Main = (props) => (
  <div className="Main">
    <ul className="links">
      <li key={'guests'}><Link to={`/Guests`}>View Guests</Link></li>
    </ul>
  </div>
);

export default Main;
