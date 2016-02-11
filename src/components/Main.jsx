import React from 'react';
import { Link } from 'react-router'

const pstyle = {marginBottom:'1.5em'};

const Main = (props) => (
  <div className="Main">
    <h2>Main</h2>
  <p style={pstyle}>
      Welcome!  This application lets you choose how to arrange guests around a table for some social occasion
    </p>

    <p style={pstyle}>
      On the <Link to={`/Guests`}>View Guests Page</Link>, you can see a list of all the guests currently available.  Click on a guest's name to see who they like or dislike
    </p>

    <p style={pstyle}>
      On the <Link to={`/Guests`}>Table Page</Link>, arrange those guests around a table.  When a placement turns red, that guest is not happy with their neighboring guests.  When it turns green, that guest is very happy with the neighboring guests
    </p>
  </div>
);

export default Main;
