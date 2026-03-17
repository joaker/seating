import React from 'react';
import styles from './TopBar.module.scss';

interface TopBarProps {
  score?: number;
  hasScore: boolean;
  optimizing: boolean | Date;
  progressRatio: number;
  onOptimize: () => void;
  canOptimize: boolean;
}

const getScoreClass = (score: number): string => {
  if (score >= 90) return styles.scoreHappy;
  if (score >= 80) return styles.scoreAccent;
  if (score >= 70) return styles.scoreWarning;
  return styles.scoreAngry;
};

const TopBar: React.FC<TopBarProps> = ({
  score,
  hasScore,
  optimizing,
  progressRatio,
  onOptimize,
  canOptimize,
}) => {
  const isOptimizing = !!optimizing;

  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>Seatable</span>

      <div className={styles.rightGroup}>
        {hasScore && score != null && (
          <span className={`${styles.scorePill} ${getScoreClass(score)}`}>
            {score}
          </span>
        )}

        <button
          className={styles.optimizeButton}
          onClick={onOptimize}
          disabled={!canOptimize || isOptimizing}
        >
          {isOptimizing ? 'Optimizing\u2026' : 'Optimize'}
        </button>
      </div>

      {isOptimizing && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(progressRatio ?? 0) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default TopBar;
