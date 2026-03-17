import styles from './App.module.scss';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import { useVenueState } from '../hooks/useVenueState';
import { useOptimizer } from '../hooks/useOptimizer';
import { setMode, setTemperature } from '../app/action-creators';
import * as venueParams from '../data/venue';

const getFriendlyScore = (score) => venueParams.maxScore + score;

export const App = (props) => {
  const { children, menu } = props;
  const location = useLocation();
  const dispatch = useDispatch();
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

  const handleOptimize = (optMode, optTemperature) => {
    if (!hasGuests) return;
    const useMode = optMode || mode;
    const useTemp = optTemperature || temperature;

    // Update Redux state so sidebar stays in sync
    if (optMode && optMode !== mode) dispatch(setMode(optMode));
    if (optTemperature && optTemperature !== temperature) dispatch(setTemperature(optTemperature));

    optimize(guests, useTemp, score, seatsPerTable, useMode);
  };

  // Page transition: crossfade on route change
  const [faded, setFaded] = useState(false);
  const prevKeyRef = useRef(location.key);

  useEffect(() => {
    if (location.key !== prevKeyRef.current) {
      prevKeyRef.current = location.key;
      setFaded(true);
      const t = setTimeout(() => setFaded(false), 150);
      return () => clearTimeout(t);
    }
  }, [location.key]);

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
          currentMode={mode}
          currentTemperature={temperature}
        />

        <div className={styles.appContent}>
          <main className={`${styles.pageContent} ${faded ? styles.pageFaded : ''}`}>
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
          onOptimize={() => handleOptimize()}
          canOptimize={hasGuests && !optimizing}
        />
      </div>
    </DndProvider>
  );
};

export default App;
