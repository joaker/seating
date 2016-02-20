import styles from '../../style/venue.css';
import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import * as scorer from '../../app/scorer';

const UnconnectedVenueSeat = ({seat, angry, happy, moodScore, empty}) => {
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

const VenueSeat = connect(
  mapStateSeat,
  mapDispatchSeat
)(UnconnectedVenueSeat);

export default VenueSeat;
