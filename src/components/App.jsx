import styles from '../style/app.css';

import React from 'react';
import {Link} from 'react-router';
import Nav from './Nav';

//const App = (props) => props && props.children;

const App = (props) => (
  <div className="AppComponent row" >
    <div className="hidden-xs col-sm-3 col-md-2">
      <Nav/>
    </div>
    <div className="col-xs-12 col-sm-9 col-md-10">
      <main>
        <ul className={styles["breadcrumbs-list"]}>
          {props.routes.map((item, index) =>
            <li key={index}>
              <Link
                onlyActiveOnIndex={true}
                activeClassName={styles["breadcrumb-active"]}
                to={item.path || ''}>
                {item.title}
              </Link>
              {(index + 1) < props.routes.length && '\u2192'}
            </li>
          )}
        </ul>
        {props.children}
      </main>
    </div>
  </div>
);

export default App;
