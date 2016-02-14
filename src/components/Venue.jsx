import styles from '../style/venue.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import {populateVenue, quenchVenue, scoreVenue, startOptimization, endOptimization} from '../app/action_creators';
import range from '../util/range';

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

const UnconnectedSeat = ({seat, angry, happy, moodScore}) => {
  const moodClass = angry ? styles.happy : (happy ? styles.angry : 'neutral');
  return (
    <div className={cnames("GuestSeat", styles.seat, moodClass)}></div>
  );
}

const mapStateSeat = (state = Map(), ownProps) => {
  const start = ownProps.tableStart;
  const end = ownProps.tableEnd;
  const tableGuests = state.get('venueGuests', List()).slice(start, end).toJS();

  const seat = ownProps.seat;

  const hates = state.getIn(
    ['venueGuests', seat, 'hates'],
    List()
  ).toJS();

  const likes = state.getIn(
    ['venueGuests', seat, 'likes'],
    List()
  ).toJS();

  const angry = tableGuests.filter(g => hates.includes(g.id)).length;
  const happy = tableGuests.filter(g => likes.includes(g.id)).length;

  const moodScore = angry > 0 ? (angry * -1) : happy;

  let whatever = 0;
  if(angry){
    whatever = 'super angry';
  }

  return {
    ownProps,
    angry: angry,
    happy: (!angry && happy > 0),
    moodScore: moodScore,
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

class Venue extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  render(){
    const clearTableStyle = {
      display: 'inline-block',
      float: 'right',
    };
    const vRows = rows.map( (row, index) => (<VenueRow key={index} row={row} />));
    return (
      <div className={cnames(styles.venue, "Venue")}>
        <div className={cnames('headerTable', 'container-fluid')}>
          <div className={cnames('row')}>
            <div className={cnames('col-xs-12')}>
              <h2 style={{display: 'block'}}>
                Venue {this.props.score ? '(Score: '+this.props.score+')' : '-'}
                {this.props.optimizing ? <div style={{display: 'inline-block', textAlign: 'center', color: 'green'}}>Optimizing</div> : ''}
                <button className={cnames('btn btn-default ')} onClick={() => this.props.populate()} style={clearTableStyle}>
                  Populate Table
                </button>
                <button className={cnames('btn btn-default ')} onClick={() => this.props.optimize()} style={clearTableStyle}>
                  Optimize
                </button>
              </h2>
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

const mapStateToProps = (state = Map(), props = {}) => {
  return {
    guests: state.get('venueGuests', List()).toJS(),
    score: state.get('venueScore'),
    optimizing: state.get('optimizing'),
  };
};

const wait = 20;
const longSize = 10;
const longWait = 500;
const waitAndAct = (dispatch, actions) => {

    // console.log('dispatching...');
    if (!actions || !actions.length) return;

    const act = actions.shift();
    dispatch(act);
    const nextWait = (actions.length % longSize) ? wait : longWait;
    setTimeout(() => waitAndAct(dispatch, actions), wait);
}

function dispatchActions(dispatch, actions) {
    var iterations = [];
    waitAndAct(dispatchActions, actions);
    // actions.forEach((action, ith) => {
    //     iterations.push(delayedDispatch(dispatch, actions, ith));
    // });
    //
    // return Promise.all(iterations).then(function(output) {
    //   dispatch(scoreVenue(seatsPerTable));
    //   dispatch(endOptimization());
    //   return 'victory';
    // });
}

const temperatures = (max) => range(max).reverse();

const dispatchOptimizations = (dispatch) => {
  dispatch(startOptimization());
  const maxTemperature = 300;
  const quenchActions = temperatures(maxTemperature).map((temp, index) => {
    return quenchVenue(seatsPerTable, temp, maxTemperature);
  });
  /* clean up steps */
  quenchActions.push(scoreVenue(seatsPerTable));
  quenchActions.push(endOptimization());

  waitAndAct(dispatch, quenchActions);
  // quenchActions.push(scoreVenue(seatsPerTable))
  // quenchActions.reduce(dispatch);
  // dispatch(scoreVenue(seatsPerTable))
  // dispatch(endOptimization());
}

const mapDispatchToProps = (dispatch) => ({
  populate: () => {dispatch(populateVenue(guestCount)); dispatch(scoreVenue(seatsPerTable));},
  optimize: () => dispatchOptimizations(dispatch)
});

const ConnectedVenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(Venue)
export default ConnectedVenue;
