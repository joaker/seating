import styles from '../style/generateGuests.module.scss';

import cnames from 'classnames/dedupe';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SeatingAppState } from '../app/types';

import { setDraftProperty, commitDraft, populateVenue, scoreVenue } from '../app/action-creators';
import * as params from '../data/venue';

const Row = ({ children }: { children?: React.ReactNode }) => (<div className={cnames('row', styles.row)}>{children}</div>);
const LabelColumn = ({ children }: { children?: React.ReactNode }) => (<div className={cnames(styles.generateLabel, 'col-md-6')}><label>{children}</label></div>);
const LabelDetail = ({ children }: { children?: React.ReactNode }) => (<div className={cnames(styles.generateDetail)}>{children}</div>);
const ValueColumn = ({ children }: { children?: React.ReactNode }) => (<div className={cnames(styles.generateValue, 'col-md-6')}>{children}</div>);

const SeatsPerTable = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const options = params.seatsPerTableValues.map(i => (<option key={i} value={i}>{i}</option>));
  return (<select {...props} className={cnames(styles.seatsPerTable, 'form-control')}>{options}</select>);
};

const Difficulty = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const options = params.difficultyRatings.map(i => (<option key={i} value={i}>{i}</option>));
  return (<select {...props} className={cnames(styles.difficultyRating, 'form-control')}>{options}</select>);
};

const noConversion = (v: any) => v;
const getValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const value = e.target.value;
  const intValue = parseInt(value);
  return intValue;
};
const handlerFactory = (act: (name: string, value: any) => void) =>
  (name: string, converter: (v: any) => any = noConversion) =>
  (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    act(name, converter(getValue(event)));

const defaultConfig = {
  guestCount: params.guestCount,
  seatsPerTable: params.seatsPerTable,
  difficulty: params.difficulty,
};

const calcTables = (guestCount: number, seatsPerTable: number) => Math.ceil(guestCount / seatsPerTable);

const mergeConfigs = (configs: Record<string, any>[]) => {
  const merged: Record<string, any> = {};
  configs.forEach(config => {
    for (const k in config) {
      const v = config[k];
      if (!v) continue;
      merged[k] = v;
    }
  });
  return merged;
};

const GenerateGuests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Inline mapStateToProps
  const liveConfig = useSelector((state: SeatingAppState) => ({
    difficulty: state.difficulty,
    guestCount: state.guestCount,
    seatsPerTable: state.seatsPerTable,
  }));
  const draftConfig = useSelector((state: SeatingAppState) => state.draftConfig ?? {});

  const config = mergeConfigs([defaultConfig, liveConfig, draftConfig]);
  const { guestCount, seatsPerTable, difficulty } = config as { guestCount: number; seatsPerTable: number; difficulty: number };
  const tableCount = calcTables(guestCount, seatsPerTable);

  // Inline mapDispatchToProps
  const setDraftProp = (key: string, value: any) => dispatch(setDraftProperty(key, value));
  const commitAndPopulate = (nextAction: () => void) => {
    dispatch(commitDraft());
    dispatch(populateVenue(guestCount));
    dispatch(scoreVenue(seatsPerTable));
    nextAction();
  };

  const nextAction = () => navigate('/seating');
  const changer = handlerFactory(setDraftProp);

  return (
    <div className={cnames(styles.panel)}>
      <h2 className={'text-muted'}>Generate Venue Guests</h2>
      <div className={cnames('container-fluid', styles.config)}>
        <Row>
          <ValueColumn>
            <input onChange={changer('guestCount')} type="number" min={params.minGuestCount} max={params.maxGuestCount} className="form-control" value={guestCount} />
          </ValueColumn>
          <LabelColumn>Guest Count</LabelColumn>
        </Row>
        <Row>
          <ValueColumn>
            <SeatsPerTable onChange={changer('seatsPerTable')} value={seatsPerTable} />
          </ValueColumn>
          <LabelColumn>Seats Per Table</LabelColumn>
        </Row>
        <Row>
          <ValueColumn>
            <input readOnly disabled value={tableCount} type="number" min="3" className="form-control" />
          </ValueColumn>
          <LabelColumn>Table Count</LabelColumn>
        </Row>
        <Row>
          <ValueColumn>
            <Difficulty onChange={changer('difficulty', v => params.fromDifficultyRating(v))} value={params.toDifficultyRating(difficulty)} />
          </ValueColumn>
          <LabelColumn>
            Social Radius
            <LabelDetail>
              Average number of opinions of held by guests
            </LabelDetail>
          </LabelColumn>
        </Row>
        <Row>
          <ValueColumn>
            <button className={'btn btn-block btn-success'} onClick={() => commitAndPopulate(nextAction)}>Generate Guests</button>
          </ValueColumn>
          <LabelColumn></LabelColumn>
        </Row>
      </div>
    </div>
  );
};

export default GenerateGuests;
