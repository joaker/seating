import styles from '../../style/venue.module.scss';

import cnames from 'classnames/dedupe';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as params from '../../data/venue';
import { setMode, clearFocusedGuest, scoreVenue, setTemperature } from '../../app/action-creators';
import names from '../../data/names';
import { useVenueState } from '../../hooks/useVenueState';
import { useOptimizer } from '../../hooks/useOptimizer';
import { SeatingAppState } from '../../app/types';

const EmptyFocusOverview = (<div className="noFocusOverview" />);
const NoItemNode = (<div><label style={{ color: '#AAA' }}>None</label></div>);

const FocusOverview = ({ focusedGuest, clearFocus }: { focusedGuest: any; clearFocus: () => void }) => {
  if (!focusedGuest) return EmptyFocusOverview;
  const focused = focusedGuest;
  const hates = focused.hates || [];
  const likes = focused.likes || [];
  return (
    <div className={cnames(styles.focusOverview, 'focusOverview')}>
      <h4 className={cnames(styles.focusName)} onClick={() => clearFocus()}>
        <label>Focused <span className={cnames(styles.icon, 'fa', 'fa-times')}></span></label>
      </h4>
      <div className={cnames('text-muted', styles.related)}>{names.get(focused.id)}</div>
      <label style={{ color: '#AAA' }}>Conflicts</label>
      {
        hates.length ? (
          hates.map((i: number) => (<div key={i} className={styles.related}>{names.get(i)}</div>))
        ) : NoItemNode
      }
      <label style={{ color: '#AAA' }}>Affinifies</label>
      {
        likes.length ? (
          likes.map((i: number) => (<div key={i} className={styles.related}>{names.get(i)}</div>))
        ) : NoItemNode
      }
    </div>
  );
};

const marks: Record<number, string> = {};
for (let i = params.minSize; i <= params.maxSize; i += params.interval) {
  const value = i;
  const message = (value === params.minSize) ? 'Quick' : (value === params.maxSize ? 'Thorough' : '');
  marks[value] = message;
}

const getFriendlyScore = (score: any) => params.maxScore + score;

const getScoreType = (guests: any[], score: any): string => {
  const hasG = guests && guests.length;
  if (!hasG) return '';
  const s = getFriendlyScore(score);
  if (s >= params.maxScore) return 'perfect';
  if (s >= 90) return 'good';
  if (s >= 80) return 'ok';
  return 'bad';
};

const optimizeTip = 'Search for a better arrangement';

const VenueMenu = () => {
  const dispatch = useDispatch();
  const venueState = useVenueState();
  const optimize = useOptimizer();

  // focusedGuest is not in useVenueState (venue-slice concern, not optimization state)
  const focusedGuest = useSelector((state: SeatingAppState) => state.focusedGuest);

  const { guests, score, hasScore, temperature, seatsPerTable, mode = params.defaultMode } = venueState;

  const hasGuests = guests && guests.length;
  const noGuests = !hasGuests;

  const scoreBlockStyle = {
    display: 'inline-block',
    margin: 0,
    visibility: (hasGuests ? '' : 'collapse') as any,
  };
  const scoreNumberStyle = { display: 'inline-block', border: 'none' };

  const scoreType = getScoreType(guests, score);
  const scoreStyle = (styles as any)[scoreType];
  const scoring = hasScore ?
    (<div className={cnames(styles.scoring, 'Score', scoreStyle)} style={scoreBlockStyle}>
      <div className={cnames(styles.title, 'title')} style={scoreBlockStyle}>Score</div>
      <div className={cnames(styles.value, 'scoring')} style={scoreNumberStyle}>{getFriendlyScore(score)}</div>
    </div>) :
    ('');

  return (
    <div className={cnames(styles.venueMenu, 'venuMenu')}>
      <h2 className={styles.venuMenuTitle} style={{ margin: 0 }}>{scoring}</h2>
      <div className={styles.venueMenuItemsContainer}>
        <ul className={styles.venueMenuItems}>
          <li>
            <button
              className={cnames('btn btn-block btn-outline-secondary', (noGuests ? '' : 'btn-primary'))}
              onClick={() => optimize(guests, temperature, score, seatsPerTable, mode as any)}
              title={optimizeTip}
              disabled={!!noGuests}
            >
              Optimize
            </button>
          </li>
          <li>
            <h4 style={{ color: '#777' }}><label>Run Time</label></h4>
            <input type="range"
              min={params.minSize} max={params.maxSize}
              value={params.toSize(temperature)}
              onChange={(e) => dispatch(setTemperature(params.toTemperature(parseFloat(e.target.value))))}
            />
            <div className={styles.runtimeLabels}>
              <label className={cnames('float-start', 'text-muted')}>Quick</label>
              <label className={cnames('float-end', 'text-muted')}>Thorough</label>
            </div>
          </li>
          <li>
            <h4 style={{ color: '#777' }}><label>Mode</label></h4>
            <select value={mode} onChange={(e) => {
              console.log('mode is changing...');
              dispatch(setMode(e.target.value as any));
              dispatch(scoreVenue(seatsPerTable));
            }} className={'form-control block'} >
              <option value='hate'>Avoid conflict</option>
              <option value='like'>Group likes</option>
              <option value='best'>Balanced</option>
            </select>
          </li>
          <li>
            <FocusOverview
              focusedGuest={focusedGuest}
              clearFocus={() => dispatch(clearFocusedGuest())}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VenueMenu;
