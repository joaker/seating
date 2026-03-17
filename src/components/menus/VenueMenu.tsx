import styles from './VenueMenu.module.scss';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as params from '../../data/venue';
import { setMode, clearFocusedGuest, scoreVenue, setTemperature } from '../../app/action-creators';
import { useVenueState } from '../../hooks/useVenueState';
import { SeatingAppState } from '../../app/types';
import GuestFocusPanel from '../GuestFocusPanel';

const getFriendlyScore = (score: any) => params.maxScore + score;

const getScoreClass = (guests: any[], score: any): string => {
  const hasG = guests && guests.length;
  if (!hasG) return '';
  const s = getFriendlyScore(score);
  if (s >= params.maxScore) return styles.scorePerfect;
  if (s >= 90) return styles.scoreGood;
  if (s >= 80) return styles.scoreOk;
  return styles.scoreBad;
};

const VenueMenu = () => {
  const dispatch = useDispatch();
  const venueState = useVenueState();

  const focusedGuest = useSelector((state: SeatingAppState) => state.focusedGuest);

  const { guests, score, hasScore, temperature, seatsPerTable, mode = params.defaultMode } = venueState;

  const scoreClass = getScoreClass(guests, score);

  return (
    <div className={styles.venueMenu}>
      {/* Score display */}
      {hasScore ? (
        <div className={`${styles.scoreBlock} ${scoreClass}`}>
          <span className={styles.scoreTitle}>Score</span>
          <span className={styles.scoreValue}>{getFriendlyScore(score)}</span>
        </div>
      ) : null}

      {/* Duration / Run Time slider */}
      <div>
        <label className={styles.sectionLabel}>Duration</label>
        <input
          type="range"
          className={styles.rangeSlider}
          min={params.minSize}
          max={params.maxSize}
          step={params.interval}
          value={params.toSize(temperature)}
          onChange={(e) => dispatch(setTemperature(params.toTemperature(parseFloat(e.target.value))))}
        />
        <div className={styles.rangeLabels}>
          <span>Quick</span>
          <span>Thorough</span>
        </div>
      </div>

      {/* Strategy / Mode selector */}
      <div>
        <label className={styles.sectionLabel}>Strategy</label>
        <select
          value={mode}
          onChange={(e) => {
            dispatch(setMode(e.target.value as any));
            dispatch(scoreVenue(seatsPerTable));
          }}
          className={styles.control}
        >
          <option value="hate">Avoid conflict</option>
          <option value="like">Group friends</option>
          <option value="best">Balanced</option>
        </select>
      </div>

      {/* Focused guest overview */}
      <GuestFocusPanel
        focusedGuest={focusedGuest}
        onClear={() => dispatch(clearFocusedGuest())}
      />
    </div>
  );
};

export default VenueMenu;
