import styles from '../style/Nav.module.scss';

import React from 'react';
import {Link} from 'react-router-dom';
import cnames from 'classnames/dedupe';

const Nav = ({children}) => (
  <div className={cnames('NavSidebar', styles.nav, 'hidden-xs', 'sticky', 'col-sm-3', 'col-md-2')}>
    <div className={cnames('ScrollingSidebar', cnames.navContent)}>
      <ul className={cnames(styles['links'],'nav', 'nav-pills', 'nav-stacked')} >
        <li key={'main'}><Link to={`/`}>Main</Link></li>
        <li key={'venue'}><Link to={`/generate-guests`}>Generate</Link></li>
      </ul>
      {children}
    </div>
  </div>
);

export default Nav;
