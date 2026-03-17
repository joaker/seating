import styles from './App.module.scss';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import { useVenueState } from '../hooks/useVenueState';
import { useOptimizer } from '../hooks/useOptimizer';
import * as venueParams from '../data/venue';

const getFriendlyScore = (score) => venueParams.maxScore + score;

export const App = (props) => {
  const { children, menu } = props;
  const location = useLocation();
  const venueState = useVenueState();
  const optimize = useOptimizer();

  const {
    guests,
    score,
    hasScore,
    optimizing,
    progressRatio,
    temperature,
    seatsPerTable,
    mode,
  } = venueState;

  const hasGuests = guests && guests.length > 0;
  const friendlyScore = hasScore ? getFriendlyScore(score) : undefined;

  const handleOptimize = () => {
    if (hasGuests) {
      optimize(guests, temperature, score, seatsPerTable, mode);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.appShell}>
        <TopBar
          score={friendlyScore}
          hasScore={!!hasScore}
          optimizing={optimizing}
          progressRatio={progressRatio ?? 0}
          onOptimize={handleOptimize}
          canOptimize={hasGuests && !optimizing}
        />

        <div className={styles.appContent}>
          <main className={styles.pageContent}>
            {children}
          </main>

          {menu && (
            <aside className={styles.controlSidebar}>
              {menu}
            </aside>
          )}
        </div>

        <BottomTabBar
          currentPath={location.pathname}
          optimizing={optimizing}
          progressRatio={progressRatio ?? 0}
          onOptimize={handleOptimize}
          canOptimize={hasGuests && !optimizing}
        />
      </div>
    </DndProvider>
  );
};

export default App;
