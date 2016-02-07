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
  </ul>
);

export default Nav;
//
// export const NavLinks = () => (
//   <ul className={cnames(styles["links"])}>
//     <li key={'main'}><Link to={`/`}>Main</Link></li>
//     <li key={'guests'}><Link to={`/Guests`}>View Guests</Link></li>
//   </ul>
// );
//
//
// export class NavAffix extends React.Component {
//   render(){
//     return (
//       <div className='applicationSidebar'>
//         <AutoAffix viewportOffsetTop={15} container={this}>
//           <NavLinks/>
//         </AutoAffix>
//       </div>
//     );
//   }
// }
