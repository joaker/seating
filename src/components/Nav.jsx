import styles from '../style/Nav.css';

import React from 'react';
import {Link} from 'react-router';
import cnames from 'classnames/dedupe';
import AutoAffix from 'react-overlays/lib/AutoAffix';

const Nav = () => (
  <ul className={cnames(styles['links'],'nav', 'nav-pills', 'nav-stacked')} data-spy="affix" data-offset-top="30">
    <li key={'main'}><Link to={`/`}>Main</Link></li>
    <li key={'guests'}><Link to={`/Guests`}>View Guests</Link></li>
    <li key={'table'}><Link to={`/Table`}>Table</Link></li>
    <li key={'venue'}><Link to={`/Venue`}>Venue</Link></li>
  </ul>
);

export default Nav;
