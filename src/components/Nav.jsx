import styles from '../style/Nav.css';

import React from 'react';
import {Link} from 'react-router';
import cnames from 'classnames/dedupe';
import AutoAffix from 'react-overlays/lib/AutoAffix';

const Nav = ({children}) => (
  <div className={'nav-sidebar'} data-spy="affix" >
    <ul className={cnames(styles['links'],'nav', 'nav-pills', 'nav-stacked')} >
      <li key={'main'}><Link to={`/`}>Main</Link></li>
      <li key={'guests'}><Link to={`/Guests`}>View Guests</Link></li>
      <li key={'table'}><Link to={`/Table`}>Table</Link></li>
      <li key={'venue'}><Link to={`/Venue`}>Venue</Link></li>
    </ul>
    {children}
  </div>
);

export default Nav;
