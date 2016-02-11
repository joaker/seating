import styles from '../style/app.css';

import React from 'react';
import {Link} from 'react-router';
import Nav from './Nav';


const LTitle = ({item = {}, params = {}}) => {
  const title = (item.title == 'Guest' && params && params.id) || item.title || 'unknown'
  return <span>{title}</span>;
};

const getHashPath = () => {
  const bigHash = window.location.hash.substring(1);

  const hashpath = (bigHash.match(/^[^?]*/i) || [])[0];

  return hashpath;
};

const Breadcrumbs = ({routes = [], params, router}) => {
  const pathRoutes = routes.filter(r => r.path);
  const hashpath = getHashPath();
  return (
    <ul className={styles["breadcrumbs-list"]}>
      {pathRoutes.map((item, index) => (
        <li key={index}>
          {
          <Link
            activeClassName={styles["breadcrumb-active"]}
            to={
              (item.path == ':id' && (index+1) == pathRoutes.length && hashpath) ||
              (index == pathRoutes.length && router.getCurrentPathname()) ||
              item.to ||
              ''}>
            <LTitle params={params} item={item} />
          </Link>
          }
          {(index + 1) < pathRoutes.length && '\u2192'}
        </li>))
      }
    </ul>
    );
}

const App = (props, context) => (
  <div className="AppComponent row" >
    <div className="hidden-xs col-sm-3 col-md-2">
      <Nav/>
    </div>
    <div className="col-xs-12 col-sm-9 col-md-10">
      <main>
        <div className="row">
        <div className="col-xs-6">
        <Breadcrumbs {...props} router={context.router}/>
        </div>
        <div className="col-xs-6" style={{textAlign: 'right'}}>
          <h2 style={{display: 'inline-block', marginTop: '.25em', marginBottom: 0, color:'#AAA'}}><strong>Seatable</strong></h2>
        </div>
        </div>
        {props.children}
      </main>
    </div>
  </div>
);

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default App;
