import React, { useEffect, useRef, useState } from 'react';
import styles from './ScorePill.module.scss';

interface ScorePillProps {
  score: number;
  hasScore: boolean;
  celebrate?: boolean;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const getColorClass = (friendlyScore: number): string => {
  if (friendlyScore >= 90) return styles.happy;
  if (friendlyScore >= 80) return styles.accent;
  if (friendlyScore >= 70) return styles.warning;
  return styles.angry;
};

const ScorePill: React.FC<ScorePillProps> = ({ score, hasScore, celebrate }) => {
  const friendlyScore = clamp(100 + score, 0, 100);
  const prevRef = useRef(friendlyScore);
  const [displayValue, setDisplayValue] = useState(friendlyScore);
  const [popping, setPopping] = useState(false);
  const rafRef = useRef<number>(0);

  // Animate counter when score changes
  useEffect(() => {
    if (!hasScore) return;
    const from = prevRef.current;
    const to = friendlyScore;
    prevRef.current = to;

    if (from === to) {
      setDisplayValue(to);
      return;
    }

    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [friendlyScore, hasScore]);

  // Pop animation on celebration
  useEffect(() => {
    if (!celebrate) return;
    setPopping(true);
    const t = setTimeout(() => setPopping(false), 600);
    return () => clearTimeout(t);
  }, [celebrate]);

  if (!hasScore) return null;

  const colorClass = getColorClass(friendlyScore);

  return (
    <span
      className={`${styles.pill} ${colorClass} ${popping ? styles.pop : ''}`}
    >
      <span className={styles.label}>Score</span>
      {displayValue}
    </span>
  );
};

export default ScorePill;
