import React, { useState, useEffect, useCallback } from 'react';
import styles from './OptimizeSheet.module.scss';
import * as params from '../data/venue';

interface OptimizeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (mode: string, temperature: number) => void;
  currentMode: string;
  currentTemperature: number;
}

const getEstimatedTime = (temperature: number): string => {
  if (temperature < 1000) return '~2 seconds';
  if (temperature < 10000) return '~10 seconds';
  if (temperature < 100000) return '~30 seconds';
  return '~2 minutes';
};

const getStepCount = (temperature: number): string => {
  return temperature.toLocaleString();
};

const OptimizeSheet: React.FC<OptimizeSheetProps> = ({
  isOpen,
  onClose,
  onStart,
  currentMode,
  currentTemperature,
}) => {
  const [mode, setMode] = useState(currentMode);
  const [sizeValue, setSizeValue] = useState(params.toSize(currentTemperature));

  const temperature = params.toTemperature(sizeValue);

  // Sync from props when sheet opens
  useEffect(() => {
    if (isOpen) {
      setMode(currentMode);
      setSizeValue(params.toSize(currentTemperature));
    }
  }, [isOpen, currentMode, currentTemperature]);

  const handleStart = useCallback(() => {
    onStart(mode, temperature);
  }, [mode, temperature, onStart]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
      />

      <div
        className={`${styles.sheet} ${isOpen ? styles.sheetOpen : ''}`}
        role="dialog"
        aria-label="Optimization settings"
      >
        <div className={styles.dragHandle} />
        <div className={styles.title}>Optimization settings</div>
        <div className={styles.divider} />

        {/* Strategy */}
        <div className={styles.sectionLabel}>Strategy</div>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="optMode"
              value="hate"
              checked={mode === 'hate'}
              onChange={() => setMode('hate')}
              className={styles.radioInput}
            />
            Minimize conflicts
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="optMode"
              value="like"
              checked={mode === 'like'}
              onChange={() => setMode('like')}
              className={styles.radioInput}
            />
            Group friends together
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="optMode"
              value="best"
              checked={mode === 'best'}
              onChange={() => setMode('best')}
              className={styles.radioInput}
            />
            Balanced
            <span className={styles.recommended}>(recommended)</span>
          </label>
        </div>

        {/* Duration */}
        <div className={styles.durationSection}>
          <div className={styles.sectionLabel}>Duration</div>
          <div className={styles.sliderRow}>
            <span className={styles.sliderEndLabel}>Fast</span>
            <input
              type="range"
              className={styles.slider}
              min={params.minSize}
              max={params.maxSize}
              step={params.interval}
              value={sizeValue}
              onChange={(e) => setSizeValue(parseFloat(e.target.value))}
            />
            <span className={styles.sliderEndLabel}>Thorough</span>
          </div>
          <div className={styles.durationHint}>
            {getEstimatedTime(temperature)} &middot; {getStepCount(Math.round(temperature))} steps
          </div>
        </div>

        {/* Start button */}
        <button className={styles.startBtn} onClick={handleStart} type="button">
          Start optimization
        </button>
      </div>
    </>
  );
};

export default OptimizeSheet;
