import styles from '../style/guests.css';
import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { seatGuest } from '../app/action_creators';
import {InputGroup, GroupButton, GroupInput} from './pure/GroupButton';

class SeatGuest extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.guestChosen = this.guestChosen.bind(this);
  }

  guestChosen(guest){

    // Seat the chosen guest
    this.props.seatGuest(guest);

    // Go back to where you came from
    this.props.history.goBack();

  }

  render(){
    return (
      <div className="SeatGuest">
        <h3>Available Guests</h3>
        <ul className="availableGuests">
          {
            this.props.available.map(g => (
              <li key={g} className={cnames(styles.guest)} onClick={this.guestChosen.bind(this, g)}>
                <a className={cnames('guest-link')}>{g}</a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const getSeated = (state) => {
  const seats = state.get('seats', Map()).toJS();
  const names = seats.values();
  return names;
}

const getAvailableGuests = (state) => {
  const all = state.get('guests').toJS() || [];
  const seated = Array.from(state.get('seats', Map()).values());
  const available = all.filter(g => !seated.includes(g));
  return available;
}

const mapStateToProps = (state) => ({
  available: getAvailableGuests(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  seatGuest: (guest) => dispatch(seatGuest(guest, props.params.id))
});

const ConnectedSeatGuest = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatGuest);

export default ConnectedSeatGuest;
