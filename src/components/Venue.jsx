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
import anneal from '../app/annealing';
import * as scorer from '../app/scorer';
import DifficultyChooser from './pure/DifficultyChooser';

const maxColumns = 12;
const offsetColumns = 2;
const contentColumns = 10;

const tablesPerRow = 10;
const guestsPerTable = 16;
const tableCount = 100;
const rowCount = tableCount / tablesPerRow + ((tableCount % tablesPerRow) ? 1 : 0);

const tableColumnCount = 3;
const tableRowCount = 3;
const seatsPerTable = tableColumnCount * tableRowCount;
const guestCount = seatsPerTable * tableCount;


const rows = range(rowCount).map(rowIndex => {
  const rowStart = rowIndex * tablesPerRow;
  const rowEnd = rowStart + tablesPerRow;
  const row = range(rowEnd, rowStart);
  return row;
});

const UnconnectedSeat = ({seat, angry, happy, moodScore, empty}) => {
  const moodClass = angry ? styles.angry : (happy ? styles.happy : (empty? styles.empty : 'neutral'));
  return (
    <div className={cnames("GuestSeat", styles.seat, moodClass)}></div>
  );
}

const mapStateSeat = (state = Map(), ownProps) => {

  const score = state.get('venueScore');
  const start = ownProps.tableStart;
  const end = ownProps.tableEnd;
  const table = state.get('venueGuests', List()).slice(start, end).toJS();
  const seat = ownProps.seat;

  const guest = table[seat];
  const ids = scorer.toIDs(table);
  const guestAnger = scorer.scoreGuest(guest, ids) * -1;

  const moodScore = 0 - guestAnger;

  const angry = guestAnger;
  const happy = 0;

  return {
    ownProps,
    angry: angry,
    happy: (!angry && happy > 0),
    moodScore: moodScore,
    score: score,
    empty: !guest,
  };
}

const mapDispatchSeat = (dispatch) => ({
});

const Seat = connect(
  mapStateSeat,
  mapDispatchSeat
)(UnconnectedSeat);
//export default Seat;

const Grid = ({height, width, table}) => {

  const margin = 0;
  const marginPercent = 2 + '%';
  const allMargin = margin * 4;

  const size = (100.0 - (width*allMargin)) / width;
  const sizePercent = size + '%';
  const seatStyle = {
    display: 'inline-block',
    textAlign: 'center',
    width: sizePercent,
    height: '1em',
    backgroundColor: 'transparent',
    border: '1px solid white',
    // marginLeft: marginPercent,
    // marginBottom: margin-Percent,
    // margin: marginPercent,
  };

  const tableStart = height * width * table;
  const tableEnd = tableStart + (height*width); // Exclusive
  const rows = range(height).map(row => {
    const rowStart = row * width;
    const seats = range(width).map(col => {
      const seatNumber = rowStart + col;
      return (
        <div key={col} className={styles.seatWrapper} style={seatStyle}>
          <Seat seat={seatNumber} tableStart={tableStart} tableEnd={tableEnd}/>
        </div>);
    });
    return(
      <div key={row} className={styles.tableRow}>
        {seats}
      </div>
    );
  });
  return (
    <div className={cnames(styles.seatRow)} style={{textAlign: 'center'}}>
      {rows}
    </div>
  );
}

const StartHint = ({children}) => (
  <div className="startHint text-success" style={{display:'inline-block', float: 'right',}}>
    <label style={{display:'inline-block', marginRight: '.5em', marginTop:'-1em'}}>{children}</label>
    <span style={{fontSize:'80%'}} className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
  </div>
);

const VTable = ({table}) => {
  return (
    <div className={styles.table}>
      <div><label>Table {table}</label></div>
      <Grid height={tableRowCount} width={tableColumnCount} table={table}></Grid>
    </div>
  );
};

const VenueCell = ({children, table, isBuffer}) => {
  return (
    isBuffer ? <div className={cnames('venueCell', styles.cell, 'col-xs-1', styles.buffer)}></div> :
    <div className={cnames('venueCell', styles.cell, 'col-xs-1')}>
      <VTable table={table}>{children}</VTable>
    </div>);
}

const VenueRow = ({row}) => {
  const tables = row.map(table => (<VenueCell key={table} table={table}>Table #{table}</VenueCell>));
  return (
    <div className={cnames('venueRow', 'row')}>
      <VenueCell key={"buffer"} isBuffer={true}></VenueCell>
      {tables}
    </div>
  );
}

const maxScore = 100;

// const Loader = ({type = 'ball-grid-beat'}) => (
//   <div className="loader">
//     <div className={cnames('loader-inner', type)}>
//       <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
//     </div>
//   </div>);

const Expander = ({expanded}) => expanded ?
  <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span> :
  <span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>;

//const minutesPerDegree = 1000; // 10^3
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
    const vRows = rows.map( (row, index) => (<VenueRow key={index} row={row} />));

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


    const ratio = this.props.progressRatio || 0;
    const percent = Math.round(ratio * 100);
    const progressPercent = percent + '%';

    const progress = (
      <div className="progress">
        <div className={cnames('progress-bar', 'progress-bar-info')} role="progressbar" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={1} style={{minWidth: '2em', width: progressPercent}}>
          {progressPercent}
        </div>
      </div>)

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
                {progress}
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
        <div className={cnames(styles.venueGrid, 'container-fluid')}>
          {vRows}
        </div>
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
    dispatch(scoreVenue(seatsPerTable));
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

    const tableSize = seatsPerTable;
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
  populate: () => {dispatch(populateVenue(guestCount)); dispatch(scoreVenue(seatsPerTable));},
  optimizeGuests: (guests, temperature, score) => optimize(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature),
  scoreTables: () => dispatch(scoreVenue(seatsPerTable)),
  setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
  toggleVenueDetails: () => dispatch(toggleVenueDetails()),
  setTemperature: (temperature) => dispatch(setTemperature(temperature)),
});

const ConnectedVenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(Venue)
export default ConnectedVenue;
