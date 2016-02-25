import styles from '../../style/venue.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import {Loader} from 'react-loaders';
var RCSlider = require('rc-slider');


import * as params from '../../data/venue.js';
import {setMode, populateVenue, quenchVenue, setVenueGuests, scoreVenue, startOptimization, endOptimization, setMaxDifficulty, toggleVenueDetails, setTemperature} from '../../app/action_creators';
import DifficultyChooser from '../pure/DifficultyChooser';
import optimizer from '../../app/optimization/optimizer';


const marks = {};
for(let i = params.minSize; i <= params.maxSize; i+= params.interval){
  const value = i;
  const message = (value == params.minSize) ? 'Quick' : (value == params.maxSize ? 'Thorough' : '');
  marks[value] = message;
}


const calculateVenueScore = (guests, tableSize) => {
  let score = 0;
  for(let i = 0; i < guests.length; i += tableSize){
    score += scorer.scoreTable(guests.slice(i, i+tableSize));
  }
  return score;
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
  if(!hasGuests(props)) return '';
  const s = getFriendlyScore(props);
  if(s >= params.maxScore) return "perfect";
  if( s >= 90) return "good";
  if( s >= 80) return "ok";
  return "bad";
}

const hasGuests = (props) => {
  return props.guests && props.guests.length;
}

const optimizeTip = hasGuests ? 'Search for a better arrangement' : 'Populate the venue to allow searching';
const populateTip = hasGuests ? 'Clear and make new guests with new seat assignments' : 'Randomly fill the venue with new guests';

const UnconnectedVenueMenu = (props) => {

  const {mode = 'hate'} = props;
  const hasGuests = props.guests && props.guests.length;
  const noGuests = !hasGuests;

  const scoreBlockStyle = {
    display: 'inline-block',
    margin:0,
    visibility: (hasGuests ? '':'collapse'),
  };
  const scoreNumberStyle = {display: 'inline-block', border: 'none',};

  const scoreType = getScoreType(props);
  const scoreStyle = styles[scoreType];
  const scoring = props.hasScore ?
    (<div className={cnames(styles.scoring, "Score", scoreStyle)} style={scoreBlockStyle}>
      <div className={cnames(styles.title, "title")} style={scoreBlockStyle}>Score</div>
      <div className={cnames(styles.value, "scoring")} style={scoreNumberStyle}>{getFriendlyScore(props)}</div>
    </div>):
    ('');

  // const collapsed = false ? 'collapse': '';
  // const indicatorStatus = {
  //   margin:0,
  //   visibility: (props.optimizing? '': collapsed)
  // };
  // const optimizationIndicator = (
  //   <div className={cnames(styles.busy)} style={indicatorStatus}>
  //     Busy
  //     <Loader type='ball-grid-beat' active={true}/>
  //   </div>
  // );

  return (
    <div>
      <ul className={styles.venueMenuItems}>
        <li><h2 style={{margin:0}}>{scoring}</h2></li>
        <li>
          <Link to='/Venue/GenerateGuests' className="btn btn-block btn-info">Create Venue</Link>
        </li>
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
          <h4 style={{color: '#777'}}><label>Mode</label></h4>
          <select value={mode} onChange={(e) => {
              console.log('mode is changing...')
              props.setMode(e.target.value)
            }} className={'form-control block'} >
            <option value='hate'>Avoid conflict</option>
            <option value='like'>Group likes</option>
          </select>
        </li>
        <li>
          <div style={{padding: 0, paddingBottom: '1em', }}>
            <h4 style={{color: '#777'}}><label>Run Time</label></h4>
            <RCSlider
              marks={marks}
              min={params.minSize} max={params.maxSize}
              step={params.interval} defaultValue={params.defaultSize}
              onAfterChange={(size) => props.setTemperature(params.toTemperature(size))}
              className={cnames((noGuests?'hidden':'visibleSlider'))}
              />
          </div>
        </li>
      </ul>
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
    temperature: state.get('temperature'),
    seatsPerTable: state.get('seatsPerTable'),
    mode: state.get('optimizationMode', 'hate'),
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    populate: () => {dispatch(populateVenue()); dispatch(scoreVenue());},
    optimizeGuests: (guests, temperature, score, tableSize, mode) => optimizer.run(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature, tableSize, mode),
    scoreTables: () => dispatch(scoreVenue()),
    setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
    toggleVenueDetails: () => dispatch(toggleVenueDetails()),
    setTemperature: (temperature) => dispatch(setTemperature(temperature)),
    setMode: (mode) => {dispatch(setMode(mode)); dispatch(scoreVenue())},
  };
}

const VenueMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedVenueMenu);

export default VenueMenu;
