import styles from '../../style/table.css';
import guestStyles from '../../style/guests.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import { seatGuest } from '../../app/action_creators';
import range from '../../util/range';


export const BufferCell = () => (<div className={cnames('bufferCell col-md-1')}></div>);

export const TableCell = ({seatIndex, seats = {}, columnsPerSeat = 1}) => (
    <div className={cnames(styles.tableCell, 'tableCell', ("col-md-" + columnsPerSeat))}>
        <div className="hidden">Table Cell</div>
    </div>
);

const placeholder = 'Empty';

const EmptyPlace = ({seatIndex}) => (<div className={cnames(styles.emptyPlace)}>{placeholder}</div>);
const GuestPlace = (props) => (<div className={cnames(styles.guestPlace, 'glyphicon','glyphicon-user')} aria-hidden="true"></div>)

const showAvailableGuests = (seatIndex, location, router) => {
  const current = (location && location.pathname) || '/Table';
  const next = (current + '/' + seatIndex);

  //history.push(next);
  router.push(next);
}

const PlaceIcon = ({guest, seatIndex}) => (
  <div className={cnames(styles.placeSeat, styles.place)}>
    {guest ? (<GuestPlace seatIndex={seatIndex}/>) : (<EmptyPlace seatIndex={seatIndex}/>)}
  </div>
);

const PlaceName = ({guest, textStyle}) => (
  <div className={cnames(styles.placeName, styles.place, textStyle, 'noselect')}>
    {guest || <div style={{height: '1em'}}></div>}
  </div>
);

const getNeighborIDs = (seatIndex, seatsPerSide) => (
  seatIndex >= seatsPerSide ? {
    leftID: Math.max(seatIndex - 1, seatsPerSide),
    rightID: Math.min(seatIndex + 1, seatsPerSide * 2),
    oppositeID: seatIndex % seatsPerSide
  } : {
    leftID: Math.max(seatIndex - 1, 0),
    rightID: Math.min(seatIndex + 1, seatsPerSide),
    oppositeID: seatIndex + seatsPerSide
  }
);

const scorer = (name, likes, dislikes) => {
  const lscore = likes.includes(name) ? 1 : 0;
  const dlscore = dislikes.includes(name) ? 1 : 0;
  const score = lscore - dlscore;
  return score;
};

const UnconnectedSeatCell = ({seatIndex, guest, likes, dislikes, seats, seatsPerSide, columnsPerSeat, rowIndex, history, location}, context) => {
  const colClass = "col-md-" + columnsPerSeat;
  const seatingStyle = guest ? styles.seated : styles.unseated;

  const {leftID, rightID, oppositeID} = getNeighborIDs(seatIndex, seatsPerSide);
  const left = seats[leftID];
  const right = seats[rightID];
  const opposite = seats[oppositeID];

  const neighbors = [left, right, opposite];
  const scores = neighbors.map(n => scorer(n, likes, dislikes));
  const score = scores.reduce(((sum, ith) => sum+ith), 0);

  const ascore = Math.abs(score);
  const stype = score > 0 ? 'good' : (score == 0 ? 'neutral' : 'bad');

  const ratingType = 'rating-type-' + stype;
  const ratingScore = 'rating-score-' + ascore;

  const ratingTypeStyle = styles[ratingType];
  const ratingScoreStyle = styles[ratingScore];

  const textStyle = rowIndex ? styles.textDown : styles.textUp;

  let lines = [
    (<PlaceName guest={guest} key="b" textStyle={textStyle}/>),
    (<PlaceIcon guest={guest} key="a" seatIndex={seatIndex}/>),
    ];

  // if the row is facing down, flip the order
  if(rowIndex) lines = lines.reverse();

  const router = context.router;

  return (
    <div className={cnames(styles.seat, seatingStyle, ratingTypeStyle, ratingScoreStyle, colClass)} onClick={showAvailableGuests.bind(this, seatIndex, location, router)}>
      {lines}
    </div>
  );
};

UnconnectedSeatCell.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state = Map(), props = {}) => {
  var guest = props.seats[props.seatIndex];

  return {
    props,
    guest: guest,
    likes: state.getIn(['relationships', guest, 'likes'], List()).toJS(),
    dislikes: state.getIn(['relationships', guest, 'dislikes'], List()).toJS()
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export const SeatCell = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedSeatCell);
