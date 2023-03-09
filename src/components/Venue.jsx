import styles from '../style/venue.module.scss';

import cnames from 'classnames/dedupe';
import { List, Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import { populateVenue, setVenueGuests, scoreVenue, startOptimization, endOptimization, setMaxDifficulty, toggleVenueDetails, setTemperature } from '../app/action_creators';
import * as params from '../data/venue.js';

import Layout from './pure/Venue/Layout';
import Progress from './pure/Progress';
import optimizer from '../app/optimization/optimizer';
import createInjectNavigate from './createInjectNavigate';


const marks = {};

for (let i = params.minSize; i <= params.maxSize; i += params.interval) {
  const value = i;
  const message = (value == params.minSize) ? 'Quick' : (value == params.maxSize ? 'Thorough' : '');
  marks[value] = message;
}

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

  componentWillMount() {

    const guests = this.props.guests;
    const numberOfGuests = guests.length;

    if (numberOfGuests) return;

    this.props.navigate('/generate-guests');

  }

  handleChange(event) {
    const state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  getRawScore() {
    return this.props.score;
  }


  getFriendlyScore() {
    const friendly = params.maxScore + this.getRawScore();
    return friendly;
  }

  getScoreType() {
    if (!this.hasGuests()) return '';
    const s = this.getFriendlyScore();
    if (s >= params.maxScore) return "perfect";
    if (s >= 90) return "good";
    if (s >= 80) return "ok";
    return "bad";
  }

  hasGuests() {
    return this.props.guests && this.props.guests.length;
  }

  render() {
    return (
      <div className={cnames(styles.venue, "Venue")}>
        <div className={cnames('headerTable', 'container-fluid')}>
          <div className={cnames('row')}>
            <div className={cnames('col-xs-12')}>
              <h2 style={{ display: 'block' }}>
                Venue {this.props.lastRunTime ? (<div style={{ display: 'inline-block' }}><h4 className="text-muted text-veryMuted" style={{ display: 'inline-block' }}>Last Run: {this.props.lastRunTime}</h4></div>) : ''}
                <Progress ratio={this.props.progressRatio} />
              </h2>
            </div>
          </div>
        </div>
        <Layout guestCount={this.props.guestCount} seatsPerTable={this.props.seatsPerTable} />
      </div>
    );
  }
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
    lastRunTime: state.get('lastRunTime'),
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
  populate: () => { dispatch(populateVenue()); dispatch(scoreVenue()); },
  optimizeGuests: (guests, temperature = params.defaultTemperature, mode = params.defaultMode, score) => optimizer.run(makeScoredList(guests, score), opimizationDispatchRelay(dispatch), temperature, mode),
  scoreTables: () => dispatch(scoreVenue()),
  setDifficulty: (difficulty) => dispatch(setMaxDifficulty(difficulty)),
  toggleVenueDetails: () => dispatch(toggleVenueDetails()),
  setTemperature: (temperature) => dispatch(setTemperature(temperature)),
});

createInjectNavigate()

const Venue = createInjectNavigate(connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedVenue))
export default Venue;
