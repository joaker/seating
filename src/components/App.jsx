import styles from '../style/app.module.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'

import Nav from './Nav';

const separators = {
  slash: '/',
  arrow: '\u2192',
}

const separator = separators.slash;

const LTitle = ({ item = {}, params = {} }) => {
  const title = (item.title == 'Guest' && params && params.id) || item.title || 'unknown'
  return <span>{title}</span>;
};

const getHashPath = () => {
  const bigHash = window.location.hash.substring(1);

  const hashpath = (bigHash.match(/^[^?]*/i) || [])[0];

  return hashpath;
};
const resolveParam = (path, params) => (path && path.includes(':') && params[path.substring(1)]) || path;
const Breadcrumbs = (props) => {
  const { routes = [], params = {}, location, router } = props;
  const titledRoutes = routes.filter(r => (r.path || r.to) && r.title);


  const resolvedRoutes = [];
  titledRoutes.reduce((pieces, r) => {
    const piece = r.path == '/' ? '' : resolveParam(r.path, params);
    pieces.push(piece);

    const fullPath = pieces.join('/');
    const resolved = { item: r, fullPath };
    resolvedRoutes.push(resolved);

    return pieces;
  }, []);

  const routeCount = titledRoutes.length;



//  const currentPathName = typeof window !== 'undefined' && window.location && window.location.basename + window.location.pathname;
  // const hashpath = getHashPath();
  console.log('creating breadcrumbs');
  return (
    <ul className={styles["breadcrumbs-list"]}>
      {resolvedRoutes.map(({ item, fullPath }, index) => {
        const rawPath = item.path;
        const path = resolveParam(rawPath, params);
        const to = item.to;
        const l = location + '';

        return (
          <li key={index}>
            {
              <Link
                activeClassName={styles["breadcrumb-active"]}
                to={fullPath}>
                <LTitle params={params} item={item} />
              </Link>
            }
            {(index + 1) < routeCount && separator}
          </li>)
      }
      )
      }
    </ul>
  );
}

const AppLayout = (props, context) => (
  <div className="AppComponent row" >
    <div className="sidebarLayout col-4">
      <Nav>{props.menu}</Nav>
    </div>
    <div className="col-10">
      <main>
        <div className="row">
          <div className="col-xs-8">
            <Breadcrumbs {...props} {...context} />
          </div>
          <div className="col-xs-4" style={{ textAlign: 'right' }}>
            <h2 className={styles.brandName} style={{}}><strong>Seatable</strong></h2>
          </div>
        </div>
        {props.children}
      </main>
    </div>
  </div>
);
// AppLayout.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }

export const App = (props) => {
  const { fullscreen } = props;
  if (fullscreen) return (<div>{fullscreen}</div>);

  return (
    <DndProvider backend={HTML5Backend}>
      <AppLayout {...props}>{props.children}</AppLayout>
    </DndProvider>
  );
};

export default (props) => <DndProvider backend={HTML5Backend}><App {...props} /></DndProvider>
