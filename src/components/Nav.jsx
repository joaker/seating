import styles from '../style/Nav.scss';

import React from 'react';
import {Link} from 'react-router';
import cnames from 'classnames/dedupe';
import AutoAffix from 'react-overlays/lib/AutoAffix';
//'nav-sidebar', 'affix',
const Nav = ({children}) => (
  <div className={cnames(styles.nav, 'hidden-xs', 'col-sm-3', 'col-md-2')} data-spy="affix" style={{height:'100%', padding:0}}>
    <div className={cnames.navContent}>
      <ul className={cnames(styles['links'],'nav', 'nav-pills', 'nav-stacked')} >
        <li key={'main'}><Link to={`/`}>Main</Link></li>
        <li key={'guests'}><Link to={`/Guests`}>View Guests</Link></li>
        <li key={'table'}><Link to={`/Table`}>Table</Link></li>
        <li key={'venue'}><Link to={`/Venue`}>Venue</Link></li>
      </ul>
      {children}
    </div>
  </div>
);

export default Nav;
