import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SeatingAppState } from '../app/types';
import { setDraftProperty, commitDraft, populateVenue, scoreVenue } from '../app/action-creators';
import * as params from '../data/venue';
import StepperInput from './StepperInput';
import styles from './GenerateGuests.module.scss';

const defaultConfig = {
  guestCount: params.guestCount,
  seatsPerTable: params.seatsPerTable,
  difficulty: params.difficulty,
};

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
  const [building, setBuilding] = React.useState(false);

  const liveConfig = useSelector((state: SeatingAppState) => ({
    difficulty: state.difficulty,
    guestCount: state.guestCount,
    seatsPerTable: state.seatsPerTable,
  }));
  const draftConfig = useSelector((state: SeatingAppState) => state.draftConfig ?? {});

  const config = mergeConfigs([defaultConfig, liveConfig, draftConfig]);
  const { guestCount, seatsPerTable, difficulty } = config as {
    guestCount: number;
    seatsPerTable: number;
    difficulty: number;
  };

  const tableCount = Math.ceil(guestCount / seatsPerTable);
  const sliderValue = params.toDifficultyRating(difficulty);

  const setDraftProp = (key: string, value: any) => dispatch(setDraftProperty(key, value));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuilding(true);
    dispatch(commitDraft());
    dispatch(populateVenue(guestCount));
    dispatch(scoreVenue(seatsPerTable));
    navigate('/seating');
  };

  return (
    <div className={styles.generatePage}>
      <header className={styles.generateHeader}>
        <h1>Configure your venue</h1>
        <p>
          Set up the guest list and table layout, then watch the optimizer
          find the best arrangement.
        </p>
      </header>

      <form className={styles.generateForm} onSubmit={handleSubmit}>
        {/* Row 1: Guest Count + Seats Per Table */}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>How many guests?</label>
            <StepperInput
              min={params.minGuestCount}
              max={params.maxGuestCount}
              value={guestCount}
              onChange={(v) => setDraftProp('guestCount', v)}
            />
            <span className={styles.fieldHint}>20 to 5,000</span>
          </div>
          <div className={styles.formField}>
            <label>Seats per table</label>
            <select
              value={seatsPerTable}
              onChange={(e) => setDraftProp('seatsPerTable', parseInt(e.target.value, 10))}
            >
              {params.seatsPerTableValues.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span className={styles.fieldHint}>
              That&rsquo;s {tableCount} table{tableCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Row 2: Drama Slider */}
        <div className={styles.formField}>
          <label>How dramatic are your guests?</label>
          <div className={styles.sliderTrack}>
            <span className={styles.sliderLabel}>Chill</span>
            <input
              type="range"
              min={1}
              max={10}
              value={sliderValue}
              onChange={(e) =>
                setDraftProp('difficulty', params.fromDifficultyRating(parseInt(e.target.value, 10)))
              }
            />
            <span className={styles.sliderLabel}>Feuding</span>
          </div>
          <span className={styles.fieldHint}>
            Each guest has strong feelings about ~{Math.round(sliderValue * 2)} others on average
          </span>
        </div>

        {/* CTA */}
        <button type="submit" className={styles.buildBtn} disabled={building}>
          {building ? (
            <>
              <span className="fa fa-spinner fa-spin" /> Building your venue&hellip;
            </>
          ) : (
            'Build this venue'
          )}
        </button>
      </form>
    </div>
  );
};

export default GenerateGuests;
