import styles from '../../style/venue.scss';

import cnames from 'classnames/dedupe';
import { List } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import * as params from '../../data/venue.js';
import { setMode, populateVenue, clearFocusedGuest, setVenueGuests, scoreVenue, startOptimization, endOptimization, setMaxDifficulty, toggleVenueDetails, setTemperature } from '../../app/action_creators';
import optimizer from '../../app/optimization/optimizer';
import names from '../../data/names'

const EmptyFocusOverview = (<div className="noFocusOverview" />)
const NoItemNode = (<div><label style={{ color: '#AAA' }}>None</label></div>);
const FocusOverview = ({ focusedGuest, clearFocus }) => {
  if (!focusedGuest) return EmptyFocusOverview;
  const focused = focusedGuest.toJS();
  const hates = focused.hates || [];
  const likes = focused.likes || [];
  return (
    <div className={cnames(styles.focusOverview, 'focusOverview')}>
      <h4 className={cnames(styles.focusName)} onClick={() => clearFocus()}>
        <label>Focused <span className={cnames(styles.icon, 'glyphicon', 'glyphicon-remove')}></span></label>
      </h4>
      <div className={cnames('text-muted', styles.related)}>{names.get(focused.id)}</div>
      <label style={{ color: '#AAA' }}>Conflicts</label>
      {
        hates.length ? (
          hates.map(i => (<div key={i} className={styles.related}>{names.get(i)}</div>))
        ) : NoItemNode
      }
      <label style={{ color: '#AAA' }}>Affinifies</label>
      {
        likes.length ? (
          likes.map(i => (<div key={i} className={styles.related}>{names.get(i)}</div>))
        ) : NoItemNode
      }
    </div>
  )
}

const marks = {};
for (let i = params.minSize; i <= params.maxSize; i += params.interval) {
  const value = i;
  const message = (value == params.minSize) ? 'Quick' : (value == params.maxSize ? 'Thorough' : '');
  marks[value] = message;
}

const opimizationDispatchRelay = (dispatch) => ({
  start: () => dispatch(startOptimization()),
  update: (list, ratio) => dispatch(setVenueGuests(list, ratio)),
  finish: (list) => {
    dispatch(setVenueGuests(list, 1));
    dispatch(endOptimization());
    dispatch(scoreVenue());
  },
});

const makeScoredList = (guests, score) => ({
  guests: guests,
  score: score,
});



const getRawScore = (props) => {
  return props.score;
}


const getFriendlyScore = (props) => {
  const friendly = params.maxScore + getRawScore(props);
  return friendly;
}

const getScoreType = (props) => {
  if (!hasGuests(props)) return '';
  const s = getFriendlyScore(props);
  if (s >= params.maxScore) return "perfect";
  if (s >= 90) return "good";
  if (s >= 80) return "ok";
  return "bad";
}

const hasGuests = (props) => {
  return props.guests && props.guests.length;
}

const optimizeTip = hasGuests ? 'Search for a better arrangement' : 'Populate the venue to allow searching';

const UnconnectedVenueMenu = (props) => {

  const { mode = params.defaultMode, focusedGuest, clearFocus, temperature } = props;
  const hasGuests = props.guests && props.guests.length;
  const noGuests = !hasGuests;

  const scoreBlockStyle = {
    display: 'inline-block',
    margin: 0,
    visibility: (hasGuests ? '' : 'collapse'),
  };
  const scoreNumberStyle = { display: 'inline-block', border: 'none', };

  const scoreType = getScoreType(props);
  const scoreStyle = styles[scoreType];
  const scoring = props.hasScore ?
    (<div className={cnames(styles.scoring, "Score", scoreStyle)} style={scoreBlockStyle}>
      <div className={cnames(styles.title, "title")} style={scoreBlockStyle}>Score</div>
      <div className={cnames(styles.value, "scoring")} style={scoreNumberStyle}>{getFriendlyScore(props)}</div>
    </div>) :
    ('');

  return (
    <div className={cnames(styles.venueMenu, 'venuMenu')}>
      <h2 className={styles.venuMenuTitle} style={{ margin: 0 }}>{scoring}</h2>
      <div className={styles.venueMenuItemsContainer}>
        <ul className={styles.venueMenuItems}>
          <li>
            <button
              className={cnames('btn btn-block btn-default', (noGuests ? '' : 'btn-primary'))}
              onClick={() => props.optimizeGuests(props.guests, props.temperature, props.score, props.seatsPerTable, props.mode)}
              title={optimizeTip}
              disabled={noGuests}
            >
              Optimize
            </button>
          </li>
          <li>
            <h4 style={{ color: '#777' }}><label>Run Time</label></h4>
            <input type="range"
              min={params.minSize} max={params.maxSize}
              value={params.toSize(temperature)}
              onChange={(e) => props.setTemperature(params.toTemperature(e.target.value))}
            />
            <div className={styles.runtimeLabels}>
              <label className={cnames('pull-left', 'text-muted')}>Quick</label>
              <label className={cnames('pull-right', 'text-muted')}>Thorough</label>
            </div>
          </li>
          <li>
            <h4 style={{ color: '#777' }}><label>Mode</label></h4>
            <select value={mode} onChange={(e) => {
              console.log('mode is changing...')
              props.setMode(e.target.value)
            }} className={'form-control block'} >
              <option value='hate'>Avoid conflict</option>
              <option value='like'>Group likes</option>
              <option value='best'>Balanced</option>
            </select>
          </li>
          <li>
            <FocusOverview focusedGuest={focusedGuest} clearFocus={clearFocus} />
          </li>
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    guests: state.get('venueGuests', List()).toJS(),
    score: state.get('venueScore'),
    hasScore: state.get('hasVenueScore'),
    optimizing: state.get('optimizing'),
    progressRatio: state.get('optimizeProgressRatio'),
    difficulty: state.get('difficulty'),
    expanded: state.get('venueDetailsExpanded'),
    temperature: state.get('temperature', params.defaultTemperature),
    seatsPerTable: state.get('seatsPerTable'),
    mode: state.get('optimizationMode', params.defaultMode),
    focusedGuest: state.get('focusedGuest'),
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    populate: () => { dispatch(populateVenue()); dispatch(scoreVenue()); },
    optimizeGuests: (guests, temperature, score, tableSize, mode) => optimizer.run(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature, tableSize, mode),
    scoreTables: () => dispatch(scoreVenue()),
    setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
    toggleVenueDetails: () => dispatch(toggleVenueDetails()),
    setTemperature: (temperature) => dispatch(setTemperature(temperature)),
    setMode: (mode) => { dispatch(setMode(mode)); dispatch(scoreVenue()) },
    clearFocus: () => dispatch(clearFocusedGuest()),

  };
}

const VenueMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedVenueMenu);

export default VenueMenu;
