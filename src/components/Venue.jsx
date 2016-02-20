import styles from '../style/venue.css';
require('rc-slider/assets/index.css');

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import {Loader} from 'react-loaders';
var RCSlider = require('rc-slider');

import {populateVenue, quenchVenue, setVenueGuests, scoreVenue, startOptimization, endOptimization, setMaxDifficulty, toggleVenueDetails, setTemperature} from '../app/action_creators';
import range from '../util/range';
import * as params from '../data/venue.js';
import anneal from '../app/annealing';
import * as scorer from '../app/scorer';
import DifficultyChooser from './pure/DifficultyChooser';
import StartHint from './pure/StartHint';
import VenueLayout from './pure/VenueLayout';
import Expander from './pure/Expander';
import Progress from './pure/Progress';


const layoutDimensions = {rowCount: params.rowCount, columnCount: params.tablesPerRow};

const maxScore = 100;

const toTemperature = (size) => Math.pow(10, size);
const toSize = (temperature) => Math.log10(temperature);

const minSize = 3;
const defaultSize = 4; // 10000
const maxSize = 6; // 10,000,000

const minTemperature = toTemperature(minSize);
const defaultTemperature = toTemperature(defaultSize);
const maxTemperature = toTemperature(defaultSize);

const marks = {};

const interval = 0.5;
for(let i = minSize; i <= maxSize; i+= interval){
  const value = i;
  const message = (value == minSize) ? 'Quick' : (value == maxSize ? 'Thorough' : '');
  marks[value] = message;
}

// range(maxSize-minSize+1).map(index => {
//   const value = minSize + index;
//   const message = (value == minSize) ? 'Quick' : (value == maxSize ? 'Thorough' : '');
//   marks[value] = message;
// });

console.log('marks!')
console.log('marks!')
console.log('marks!')

class Venue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // Bind instance methods that need the "this" context
    this.handleChange = this.handleChange.bind(this);
    this.getRawScore = this.getRawScore.bind(this);
    this.hasGuests = this.hasGuests.bind(this);
    this.getFriendlyScore = this.getFriendlyScore.bind(this);
    this.getScoreType = this.getScoreType.bind(this);
  }

  handleChange(event){
    const state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  getRawScore(){
    return this.props.score;
  }


  getFriendlyScore(){
    const friendly = maxScore + this.getRawScore();
    return friendly;
  }

  getScoreType() {
    if(!this.hasGuests()) return '';
    const s = this.getFriendlyScore();
    if(s >= maxScore) return "perfect";
    if( s >= 90) return "good";
    if( s >= 80) return "ok";
    return "bad";
  }

  hasGuests() {
    return this.props.guests && this.props.guests.length;
  }

  render(){

    const hasGuests = this.props.guests && this.props.guests.length;
    const noGuests = !hasGuests;

    const optimizeTip = hasGuests ? 'Search for a better arrangement' : 'Populate the venue to allow searching';
    const populateTip = hasGuests ? 'Clear and make new guests with new seat assignments' : 'Randomly fill the venue with new guests';

    const clearTableStyle = {
      display: 'inline-block',
      marginLeft: '.5em',
      float: 'right',
    };

    const ibStyle = {display: 'inline-block'};
    const scoreType = this.getScoreType();
    const scoreStyle = styles[scoreType];
    const scoring = this.props.hasScore ?
      (<div className={cnames(styles.scoring, "Score", scoreStyle)} style={ibStyle}>
        <div className={cnames(styles.title, "title")} style={ibStyle}>Scoring</div>
        <div className={cnames(styles.value, "scoring")} style={ibStyle}>{this.getFriendlyScore()}</div>
      </div>):
      ('');

    const optimizationIndicator = (
      <div className={cnames(styles.busy)}>
        Optimizing
        <Loader type='ball-grid-beat' active={true}/>
      </div>
    );

    return (
      <div className={cnames(styles.venue, "Venue")}>
        <div className={cnames('headerTable', 'container-fluid')}>
          <div className={cnames('row')}>
            <div className={cnames('col-xs-12')}>
              <h2 style={{display: 'block'}}>
                Venue
                {scoring}
                {this.props.optimizing ? optimizationIndicator : ''}
                <button
                  className={cnames('btn', 'hidden')}
                  onClick={() => this.props.toggleVenueDetails()}
                  style={clearTableStyle}
                  title={optimizeTip}
                  disabled={noGuests}
                  >
                  {this.state.expanded ? 'Less': 'More'} <Expander expanded={this.props.expanded}/>
                </button>
                <button
                  className={cnames('btn btn-default', (noGuests ? '' : 'btn-primary'))}
                  onClick={() => this.props.optimizeGuests(this.props.guests, this.props.temperature, this.props.score)}
                  style={clearTableStyle}
                  title={optimizeTip}
                  disabled={noGuests}
                  >
                  Optimize
                </button>
                <div className="pull-right" style={{marginLeft: '1em', marginTop:'-.08em'}}>
                  <DifficultyChooser
                    difficulty={this.props.difficulty}
                    setDifficulty={this.props.setDifficulty}
                    onClick={() => this.props.populate()}
                    >
                    {(this.hasGuests() ? 'Discard and ' : '') + 'Create Guests'}
                  </DifficultyChooser>
                </div>
                <button
                  className={cnames('btn btn-default', 'hidden')}
                  onClick={() => this.props.scoreTables()}
                  style={clearTableStyle}
                  >
                  Score
                </button>
                <button
                  className={cnames('btn btn-default', 'hidden')}
                  onClick={() => this.props.populate()}
                  style={clearTableStyle}
                  title={populateTip}
                  >
                  {(this.hasGuests() ? 'Discard and ' : '') + 'Create Guests'}
                </button>
                {this.hasGuests() ? '' : <StartHint>start here</StartHint>}
              </h2>
            </div>
          </div>
          <div className={cnames('row', (this.props.expanded || true ? 'options': 'Nothidden'))} style={{fontSize: '80%',visibility: (noGuests? 'collapse' : 'inherit')  }}>
            <div className={cnames('col-xs-7', styles.temperature)} >
              <div style={{paddingBottom: '2em'}}>
                <h4>Progress</h4>
                <Progress ratio={this.props.progressRatio}/>
              </div>
            </div>
            <div className={cnames('col-xs-5', styles.temperature)} >
              <div style={{padding: '2em', paddingTop: 0, }}>
                <h4 style={{textAlign:'center'}}>Run Time</h4>
                  <RCSlider
                    marks={marks}
                    min={minSize} max={maxSize}
                    step={interval} defaultValue={defaultSize}
                    onAfterChange={(size) => this.props.setTemperature(toTemperature(size))}
                    className={cnames((noGuests?'hidden':'visibleSlider'))}
                    />
              </div>
            </div>
          </div>

        </div>
        <VenueLayout {...layoutDimensions} />
      </div>
    );
  }
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
    dispatch(setVenueGuests(list));
    dispatch(endOptimization());
    dispatch(scoreVenue(params.seatsPerTable));
  },
});

const temperatures = (max) => range(max).reverse();


const step = (tableSize = 9, maxTemperature = 200) => (list, currentTemperature) => {
  return anneal(list, tableSize, currentTemperature, maxTemperature);
}

const isFrozen = (t) => t < 1;
const defaultBatchDelay = 200;

const nextBatch = (list, t, props) => (
  setTimeout(() => {
    batch(list, t, props)
  }), props.delay);

const batch = (list, startT, props) => {
  if(isFrozen(startT) || list.score >= 0) {
    props.relay.finish(list.guests);
    return;
  }
  const batchEnd = Math.max(startT - props.size, 0);
  for(let t = startT; t > batchEnd; t--){
    list = props.stepper(list, t);
  }

  // TODO: Take this out
  //const score = calculateVenueScore(list.guests, props.tableSize);

  const ratio = (props.maxTemperature - batchEnd) / props.maxTemperature;

  // Post the updated lists
  props.relay.update(list.guests, ratio);

  nextBatch(list, batchEnd, props);

}

const optimize = (guests, relay, temperature = defaultTemperature) => {

    relay.start();

    const tableSize = params.seatsPerTable;
    const maxTemperature = temperature;//1000 * 10; // 1000
    //const temps = temperatures(maxTemperature);
    let list = guests;

    // This might be better as a static constant.  500 works well
    const batchSize = maxTemperature/20;

    const stepper = step(tableSize, maxTemperature);

    const batchProps = {
      size: 50,//batchSize,
      relay, stepper,
      stepper: stepper,
      delay: defaultBatchDelay,
      tableSize: tableSize,
      maxTemperature: temperature,
    };

    batch(list, maxTemperature, batchProps);

}

const makeScoredList = (guests, score) => ({
  guests: guests,
  score: score,
});

const mapStateToProps = (state = Map(), props = {}) => {
  return {
    guests: state.get('venueGuests', List()).toJS(),
    score: state.get('venueScore'),
    hasScore: state.get('hasVenueScore'),
    optimizing: state.get('optimizing'),
    progressRatio: state.get('optimizeProgressRatio'),
    difficulty: state.get('difficulty'),
    expanded: state.get('venueDetailsExpanded'),
    temperature: state.get('temperature'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  populate: () => {dispatch(populateVenue(params.guestCount)); dispatch(scoreVenue(params.seatsPerTable));},
  optimizeGuests: (guests, temperature, score) => optimize(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature),
  scoreTables: () => dispatch(scoreVenue(params.seatsPerTable)),
  setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
  toggleVenueDetails: () => dispatch(toggleVenueDetails()),
  setTemperature: (temperature) => dispatch(setTemperature(temperature)),
});

const ConnectedVenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(Venue)
export default ConnectedVenue;
