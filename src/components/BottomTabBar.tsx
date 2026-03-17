import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BottomTabBar.module.scss';

interface BottomTabBarProps {
  currentPath: string;
  optimizing: boolean | Date;
  progressRatio: number;
  onOptimize: () => void;
  canOptimize: boolean;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentPath,
  optimizing,
  progressRatio,
  onOptimize,
  canOptimize,
}) => {
  const navigate = useNavigate();
  const isOptimizing = !!optimizing;

  const isSetup = currentPath === '/generate-guests';
  const isInspect = currentPath === '/' || currentPath === '/seating';

  return (
    <nav className={styles.bottomBar}>
      {/* Setup tab */}
      <button
        className={`${styles.tab} ${isSetup ? styles.tabActive : ''}`}
        onClick={() => navigate('/generate-guests')}
        type="button"
      >
        <span className={`${styles.tabIcon} fa fa-sliders`} />
        <span className={styles.tabLabel}>Setup</span>
      </button>

      {/* Optimize tab */}
      <button
        className={`${styles.tab} ${isOptimizing ? styles.tabActive : ''} ${!canOptimize ? styles.tabDisabled : ''}`}
        onClick={onOptimize}
        disabled={!canOptimize}
        type="button"
      >
        {isOptimizing ? (
          <div className={styles.progressRing}>
            <div className={styles.progressRingCircle} />
            <div
              className={styles.progressRingFill}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  progressRatio > 0.125 ? '100% 0%' : `${50 + 50 * Math.tan(progressRatio * 2 * Math.PI)}% 0%`
                }${
                  progressRatio > 0.25 ? ', 100% 100%' : ''
                }${
                  progressRatio > 0.5 ? ', 0% 100%' : ''
                }${
                  progressRatio > 0.75 ? ', 0% 0%' : ''
                })`,
              }}
            />
            <span className={`${styles.tabIcon} ${styles.optimizingIcon} fa fa-magic`} />
          </div>
        ) : (
          <span className={`${styles.tabIcon} fa fa-magic`} />
        )}
        <span className={styles.tabLabel}>Optimize</span>
      </button>

      {/* Inspect tab */}
      <button
        className={`${styles.tab} ${isInspect ? styles.tabActive : ''}`}
        onClick={() => navigate('/')}
        type="button"
      >
        <span className={`${styles.tabIcon} fa fa-search`} />
        <span className={styles.tabLabel}>Inspect</span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
