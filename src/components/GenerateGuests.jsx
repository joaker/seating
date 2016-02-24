import styles from '../style/generateGuests.css';
require('rc-slider/assets/index.css');

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import {Loader} from 'react-loaders';
var RCSlider = require('rc-slider');

import {setDraftProperty, commitDraft, populateVenue, quenchVenue, setVenueGuests, scoreVenue, startOptimization, endOptimization, setMaxDifficulty, toggleVenueDetails, setTemperature} from '../app/action_creators';
import range from '../util/range';
import * as params from '../data/venue.js';
import anneal from '../app/optimization/annealing';
import * as scorer from '../app/scorer';
import DifficultyChooser from './pure/DifficultyChooser';
import StartHint from './pure/StartHint';
import VenueLayout from './pure/VenueLayout';
import Layout from './pure/VenueTableCollection';
import Expander from './pure/Expander';
import Progress from './pure/Progress';
import optimizer from '../app/optimization/optimizer';

const Row = ({children}) => (<div className={cnames('row', styles.row)}>{children}</div>);
const LabelColumn = ({children}) => (<div className={cnames(styles.generateLabel, 'col-md-6')}><label>{children}</label></div>)
const ValueColumn = ({children}) => (<div className={cnames(styles.generateValue, 'col-md-6')}>{children}</div>)
const FullColumn = ({children}) => (<div className={'col-md-12'}>{children}</div>)

const SeatsPerTable = (props) => {
  const options = params.seatsPerTableValues.map(i => (<option key={i} value={i}>{i}</option>));
  //range(params.maxSeatsPerTable + 1, params.minSeatsPerTable + 1).map(i => (<option key={i} value={i}>{i}</option>));
  return (<select {...props} className={styles.seatsPerTable, 'form-control'}>{options}</select>)
}

const Difficulty = (props) => {
  const options = params.difficultyRatings.map(i => (<option key={i} value={i}>{i}</option>));
  //range(params.maxSeatsPerTable + 1, params.minSeatsPerTable + 1).map(i => (<option key={i} value={i}>{i}</option>));
  return (<select {...props} className={cnames(styles.difficultyRating, 'form-control')}>{options}</select>)
}

const noConversion = (v) => v;
const getValue = e => {
  const value = e.target.value;
  const intValue = parseInt(value);
  return intValue;
};
const handlerFactory = (act) => (name, converter = noConversion) => (event) => act(name, converter(getValue(event)));

const makeNextAction = (router) => () => router.push('/Venue');

const UnconnectedGenerateGuests = (props, {router}) => {
    //const props = this.props;
    const {
      guestCount,
      seatsPerTable,
      difficulty,
      tableCount,
      setDraftProperty,
      commitAndPopulate
    } = props;

    const nextAction = makeNextAction(router);

    const changer = handlerFactory(props.setDraftProperty);

    console.log('hey')
    return (
      <div>
        <h2 className={'text-muted'}>Generate Venue Guests</h2>
        <div className={'container-fluid', styles.config}>
          <Row>
            <ValueColumn>
              <input  {...props} onChange={changer('guestCount')} type="number" min={params.minGuestCount} max={params.maxGuestCount} className="form-control" value={guestCount}/>
            </ValueColumn>
            <LabelColumn>Guest Count</LabelColumn>
          </Row>
          <Row>
            <ValueColumn>
              <SeatsPerTable {...props} onChange={changer('seatsPerTable')} value={seatsPerTable}/>
            </ValueColumn>
            <LabelColumn>Seats Per Table</LabelColumn>
          </Row>
          <Row>
            <ValueColumn>
              <input  {...props} readOnly disabled value={tableCount} type="number" min="3" className="form-control"/>
            </ValueColumn>
            <LabelColumn>Table Count</LabelColumn>
          </Row>
          <Row>
            <ValueColumn>
              <Difficulty  {...props} onChange={changer('difficulty', v => params.fromDifficultyRating(v))} value={params.toDifficultyRating(difficulty)}/>
            </ValueColumn>
            <LabelColumn>Difficulty</LabelColumn>
          </Row>
          <Row>
            <ValueColumn>
              <button className={'btn btn-block btn-success'} onClick={() => props.commitAndPopulate(nextAction)}>Generate Guests</button>
            </ValueColumn>
            <LabelColumn></LabelColumn>
          </Row>
        </div>
      </div>
    );
  }

UnconnectedGenerateGuests.contextTypes = {
  router: React.PropTypes.object.isRequired
}


const defaultConfig = {
  // tableCount: params.tableCount,
  guestCount: params.guestCount,
  seatsPerTable: params.seatsPerTable,
  difficulty: params.difficulty,
};

const mergeConfigs = (configs) => {
  const merged = {};
  configs.forEach(config => {
    for(let k in config){
      const v = config[k];
      if(!v) continue;
      merged[k] = v;
    }
  });
  return merged;
}

const calcTables = (guestCount, seatsPerTable) => Math.ceil(guestCount / seatsPerTable);
const getTableCount = (c) => calcTables(c.guestCount, c.seatsPerTable);
const mapStateToProps = (state = Map()) => {
  const liveConfig = {
    difficulty: state.get('difficulty'),
    // tableCount: state.get('tableCount'),
    guestCount: state.get('guestCount'),
    seatsPerTable: state.get('seatsPerTable'),
  };
  const draftConfig = state.get('draftConfig', Map()).toJS();

  const config = mergeConfigs([defaultConfig, liveConfig, draftConfig]);
  config.tableCount = getTableCount(config);
  return config;
};

const mapDispatchToProps = (dispatch) => ({
  setDraftProperty: (key, value) => dispatch(setDraftProperty(key, value)),
  commitAndPopulate: (nextAction) => {dispatch(commitDraft()); dispatch(populateVenue()); dispatch(scoreVenue()); nextAction();},
});

const GenerateGuests = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedGenerateGuests)


export default GenerateGuests;
