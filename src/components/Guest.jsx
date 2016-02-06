import React from 'react';
import { connect } from 'react-redux';
import { addGuest } from '../app/action_creators';
import {InputGroup, GroupButton, GroupInput} from './pure/GroupButton';
class Guest extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    var state = this.state || {};
    this.setState({ property: event.target.value });
  }

  render(){
    return (
      <div className="Guest">
        <h3>{this.props.name || defaultGuest}</h3>
        <ul className="friends">
          {
            (this.props.friends || []).map(g => (
              <li key={g}>
                {g}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const defaultGuest = "Anonymous Guest";
const getID = (g) => g;
const propID = (props) => props && props.params.id;

const mapStateToProps = (state, props) => ({
  name: state.get('guests').toJS().some(g => g == props.params.id) ?
    props.params.id : defaultGuest
});

const mapDispatchToProps = (dispatch) => ({
  addGuest: guest => dispatch(addGuest(guest))
});

const ConnectedGuest = connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
export default ConnectedGuest;
