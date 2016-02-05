import React from 'react';
import { connect } from 'react-redux';
import { addGuest } from '../app/action_creators';

class Guests extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.potentialGuestChanged = this.potentialGuestChanged.bind(this);
  }

  potentialGuestChanged(event){
    var state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  addDisabled(){
    var disabled = !this || !this.state || !this.state.newGuest || !this.state.newGuest.trim();
    return disabled;
  }

  render(){
    return (
      <div className="Guests">
        <h3>Guests</h3>
        <ul className="guests">
          {
            this.props.guests.map(g => (
              <li key={g}>
                {g}
              </li>
            ))
          }
        </ul>
        <input type="text" ref="potentialGuest" onChange={this.potentialGuestChanged} />
        <button
          onClick={(() => this.props.addGuest(this.state.newGuest)).bind(this)}
          disabled={this.addDisabled()}
          >
          Add Guest
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  guests: state.get('guests').toJS() || []
});

const mapDispatchToProps = (dispatch) => ({
  addGuest: guest => dispatch(addGuest(guest))
});

const ConnectedGuests = connect(
  mapStateToProps,
  mapDispatchToProps
)(Guests)
export default ConnectedGuests;
