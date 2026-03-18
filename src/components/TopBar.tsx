import React, { useState, useEffect, useRef } from 'react';
import styles from './TopBar.module.scss';
import ScorePill from './ScorePill';
import ProgressStrip from './ProgressStrip';
import OptimizeSheet from './OptimizeSheet';
import * as venueParams from '../data/venue';
import { useVenueState } from '../hooks/useVenueState';

interface TopBarProps {
  score?: number;
  hasScore: boolean;
  optimizing: boolean | Date;
  progressRatio: number;
  onOptimize: (mode?: string, temperature?: number) => void;
  canOptimize: boolean;
  currentMode?: string;
  currentTemperature?: number;
}

const getFriendlyScore = (score: number | undefined) => {
  return venueParams.maxScore + (score ?? 0);
}

const TopBar: React.FC<TopBarProps> = ({
  optimizing,
  progressRatio,
  onOptimize,
  canOptimize,
  currentMode = 'best',
  currentTemperature = 10000,
}) => {
  const isOptimizing = !!optimizing;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const wasOptimizing = useRef(false);

  // Detect optimization completion
  useEffect(() => {
    if (wasOptimizing.current && !isOptimizing) {
      setJustFinished(true);
      setCelebrating(true);
      const t1 = setTimeout(() => setJustFinished(false), 2000);
      const t2 = setTimeout(() => setCelebrating(false), 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    wasOptimizing.current = isOptimizing;
  }, [isOptimizing]);

  const handleOptimizeClick = () => {
    if (isOptimizing) return;
    setSheetOpen(true);
  };

  const handleStartOptimization = (mode: string, temperature: number) => {
    setSheetOpen(false);
    onOptimize(mode, temperature);
  };

  const buttonText = isOptimizing
    ? 'Optimizing\u2026'
    : justFinished
      ? '\u2713 Done!'
      : 'Optimize';

  const { score, hasScore } = useVenueState();

  const friendlyScore = getFriendlyScore(score);

  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>Seatable</span>

      <div className={styles.rightGroup}>
        <ScorePill
          score={friendlyScore}
          hasScore={!!hasScore && score != null}
          celebrate={celebrating}
        />

        <div className={styles.optimizeWrapper}>
          <button
            className={styles.optimizeButton}
            onClick={handleOptimizeClick}
            disabled={!canOptimize || isOptimizing}
          >
            {isOptimizing && (
              <span className="fa fa-spinner fa-spin" />
            )}
            {buttonText}
          </button>

          <OptimizeSheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            onStart={handleStartOptimization}
            currentMode={currentMode}
            currentTemperature={currentTemperature}
          />
        </div>
      </div>

      <ProgressStrip
        ratio={progressRatio}
        visible={isOptimizing || celebrating}
        complete={!isOptimizing && celebrating}
      />
    </header>
  );
};

export default TopBar;
