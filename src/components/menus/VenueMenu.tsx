import styles from './VenueMenu.module.scss';

import cnames from 'classnames/dedupe';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as params from '../../data/venue';
import { setMode, clearFocusedGuest, scoreVenue, setTemperature } from '../../app/action-creators';
import names from '../../data/names';
import { useVenueState } from '../../hooks/useVenueState';
import { SeatingAppState } from '../../app/types';

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

const FocusOverview = ({ focusedGuest, clearFocus }: { focusedGuest: any; clearFocus: () => void }) => {
  if (!focusedGuest) return <div />;

  const focused = focusedGuest;
  const hates = focused.hates || [];
  const likes = focused.likes || [];

  return (
    <div className={styles.focusOverview}>
      <div className={styles.focusHeader} onClick={() => clearFocus()}>
        <span className={styles.focusName}>Focused</span>
        <span className={cnames(styles.focusClose, 'fa', 'fa-times')} />
      </div>
      <div className={styles.guestName}>{names.get(focused.id)}</div>

      <div className={styles.relationSection}>
        <label className={styles.sectionLabel}>Conflicts</label>
        {hates.length ? (
          hates.map((i: number) => (
            <div key={i} className={cnames(styles.relationItem, styles.relationConflict)}>
              {names.get(i)}
            </div>
          ))
        ) : (
          <div className={styles.emptyRelation}>None</div>
        )}
      </div>

      <div className={styles.relationSection}>
        <label className={styles.sectionLabel}>Friends</label>
        {likes.length ? (
          likes.map((i: number) => (
            <div key={i} className={cnames(styles.relationItem, styles.relationFriend)}>
              {names.get(i)}
            </div>
          ))
        ) : (
          <div className={styles.emptyRelation}>None</div>
        )}
      </div>
    </div>
  );
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
        <div className={cnames(styles.scoreBlock, scoreClass)}>
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
      <FocusOverview
        focusedGuest={focusedGuest}
        clearFocus={() => dispatch(clearFocusedGuest())}
      />
    </div>
  );
};

export default VenueMenu;
