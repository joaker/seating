import styles from '../style/guests.css';
import cnames from 'classnames/dedupe';

import React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Link } from 'react-router';
import { addGuest } from '../app/action_creators';
import {InputGroup, GroupButton, GroupInput} from './pure/GroupButton';


const EmptyMessage = () => (<em><strong className="text-very-muted">No one</strong></em>);


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
        <h2>{this.props.name || defaultGuest}</h2>
        <h4 className={styles.textLike}>Likes</h4>
        <ul>
          {
            this.props.likes.length ? (this.props.likes).map(g => (
              <li key={g} className={cnames(styles.guest)}>
                <Link to={`/Guests/` + g } className={cnames(styles.guestlink)}>{g}</Link>
              </li>
            )) : (
              <li key="empty"><EmptyMessage /></li>
            )
          }
        </ul>
        <h4 className={styles.textDislike}>Dislikes</h4>
        <ul className="dislikes">
          {
            this.props.dislikes.length ? (this.props.dislikes).map(g => (
              <li key={g} className={cnames(styles.guest)}>
                <Link to={`/Guests/` + g } className={cnames(styles.guestlink)}>{g}</Link>
              </li>
            )) : (
              <li key="empty"><EmptyMessage /></li>
            )
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
    props.params.id : defaultGuest,
  likes: state.getIn(['relationships', props.params.id, 'likes'], List()).toJS(),
  dislikes: state.getIn(['relationships', props.params.id, 'dislikes'], List()).toJS()
});

const mapDispatchToProps = (dispatch) => ({
  addGuest: guest => dispatch(addGuest(guest)),
});

const ConnectedGuest = connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
export default ConnectedGuest;
