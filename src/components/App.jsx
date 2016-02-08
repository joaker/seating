import styles from '../style/app.css';

import React from 'react';
import {Link} from 'react-router';
import Nav from './Nav';


const LTitle = ({item = {}, params = {}}) => {
  const title = (item.title == 'Guest' && params && params.id) || item.title || 'unknown'
  return <span>{title}</span>;
};

const App = (props) => (
  <div className="AppComponent row" >
    <div className="hidden-xs col-sm-3 col-md-2">
      <Nav/>
    </div>
    <div className="col-xs-12 col-sm-9 col-md-10">
      <main>
        <ul className={styles["breadcrumbs-list"]}>
          {props.routes.filter(r => true).map((item, index) =>
            <li key={index}>
              {
              <Link
                onlyActiveOnIndex={true}
                activeClassName={styles["breadcrumb-active"]}
                to={item.path || item.to || ''}>
                <LTitle params={props.params} item={item} />

              </Link>
              }
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
