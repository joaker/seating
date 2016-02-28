import styles from '../style/venue.scss';
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
import anneal from '../app/optimization/annealing';
import * as scorer from '../app/scorer';
import DifficultyChooser from './pure/DifficultyChooser';
import StartHint from './pure/StartHint';
import VenueLayout from './pure/VenueLayout';
import Layout from './pure/VenueTableCollection';
import Expander from './pure/Expander';
import Progress from './pure/Progress';
import optimizer from '../app/optimization/optimizer';


const layoutDimensions = {rowCount: params.rowCount, columnCount: params.tablesPerRow};



const marks = {};


for(let i = params.minSize; i <= params.maxSize; i+= params.interval){
  const value = i;
  const message = (value == params.minSize) ? 'Quick' : (value == params.maxSize ? 'Thorough' : '');
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

class UnconnectedVenue extends React.Component {
  constructor(props, ctx) {
    super(props);
    this.state = {};

    this.router = ctx.router;

    // Bind instance methods that need the "this" context
    this.handleChange = this.handleChange.bind(this);
    this.getRawScore = this.getRawScore.bind(this);
    this.hasGuests = this.hasGuests.bind(this);
    this.getFriendlyScore = this.getFriendlyScore.bind(this);
    this.getScoreType = this.getScoreType.bind(this);
  }

  componentWillMount(){

    const guests = this.props.guests;
    const numberOfGuests = guests.length;

    if(numberOfGuests) return;

    this.router.push('/Venue/GenerateGuests');

  }

  handleChange(event){
    const state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  getRawScore(){
    return this.props.score;
  }


  getFriendlyScore(){
    const friendly = params.maxScore + this.getRawScore();
    return friendly;
  }

  getScoreType() {
    if(!this.hasGuests()) return '';
    const s = this.getFriendlyScore();
    if(s >= params.maxScore) return "perfect";
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
    const scoring = '' ;
    //  this.props.hasScore ?
    //   (<div className={cnames(styles.scoring, "Score", scoreStyle)} style={ibStyle}>
    //     <div className={cnames(styles.title, "title")} style={ibStyle}>Scoring</div>
    //     <div className={cnames(styles.value, "scoring")} style={ibStyle}>{this.getFriendlyScore()}</div>
    //   </div>):
    //   ('');

    const optimizationIndicator = (
      <div className={cnames(styles.busy)}>
        Optimizing
        <Loader type='ball-grid-beat' active={true}/>
      </div>
    );


    const spt = this.props.seatsPerTable;

    const tryNew = true;
    const layout = tryNew ?
      (<Layout guestCount={this.props.guestCount} seatsPerTable={this.props.seatsPerTable}/>):
      (<VenueLayout {...layoutDimensions} />);

    return (
      <div className={cnames(styles.venue, "Venue")}>
        <div className={cnames('headerTable', 'container-fluid')}>
          <div className={cnames('row')}>
            <div className={cnames('col-xs-12')}>
              <h2 style={{display: 'block'}}>
                Venue
                <Progress ratio={this.props.progressRatio}/>
              </h2>
            </div>
          </div>
        </div>
        {layout}
      </div>
    );
  }
}

UnconnectedVenue.contextTypes = {
  router: React.PropTypes.object.isRequired
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

const mapStateToProps = (state = Map()) => {
  return {
    guests: state.get('venueGuests', List()).toJS(),
    guestCount: state.get('guestCount'),
    seatsPerTable: state.get('seatsPerTable'),
    score: state.get('venueScore'),
    hasScore: state.get('hasVenueScore'),
    optimizing: state.get('optimizing'),
    progressRatio: state.get('optimizeProgressRatio'),
    difficulty: state.get('difficulty'),
    expanded: state.get('venueDetailsExpanded'),
    temperature: state.get('temperature'),
    seatsPerTable: state.get('seatsPerTable'),
    mode: state.get('optimizationMode'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  populate: () => {dispatch(populateVenue()); dispatch(scoreVenue());},
  optimizeGuests: (guests,temperature = params.defaultTemperature, mode=params.defaultMode, score) => optimizer.run(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature, mode),
  scoreTables: () => dispatch(scoreVenue()),
  setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
  toggleVenueDetails: () => dispatch(toggleVenueDetails()),
  setTemperature: (temperature) => dispatch(setTemperature(temperature)),
});

const Venue = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedVenue)
export default Venue;
