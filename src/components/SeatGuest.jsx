import styles from '../style/guests.css';
import cnames from 'classnames/dedupe';
import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { seatGuest } from '../app/action_creators';

class SeatGuest extends React.Component {
  constructor(props, ctx) {
    this.props = props;
    this.context = ctx;
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.guestChosen = this.guestChosen.bind(this);
  }

  guestChosen(guest){

    // Seat the chosen guest
    this.props.seatGuest(guest);

    // Go back to where you came from
    //this.props.history.goBack();
    //hashHistory.goBack();

    this.context.router.goBack();
  }

  render(){
    return (
      <div className="SeatGuest">
        <h2>Available Guests</h2>
        <ul className="availableGuests">
          <li key={'empty'} className={cnames(styles.guest, styles.emptyguest)} onClick={this.guestChosen.bind(this, 'Empty')}>
            <a className={cnames('guest-link')}>Empty</a>
          </li>
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

// SeatGuest.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }

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
