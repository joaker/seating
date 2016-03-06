import { setScoredTables, setVenueGuests, scoreVenue, startOptimization, endOptimization } from '../../app/action_creators';

import anneal from './iannealing';
import * as params from '../../data/venue.js';
import {config} from './const.js';

// const opimizationDispatchRelay = (dispatch) => ({
//   start: () => dispatch(startOptimization()),
//   update: (tables, score, ratio) => dispatch(setScoredTables(tables, score, ratio)),
//   finish: (tables, score) => {
//     dispatch(setScoredTables(tables, score, 1));
//     dispatch(endOptimization());
//     dispatch(scoreVenue());
//   },
// });


const step = (maxTemperature, mode) => (list, currentTemperature) => {
  return anneal(list, currentTemperature, maxTemperature, mode);
}

const isFrozen = (t) => t < 1;

const queueNextBatch = (scoredTables, t, props, delay) => (
  setTimeout(() => {
    batch(scoredTables, t, props)
  }), delay);

const batch = (scoredTables, startT, props) => {
  if(isFrozen(startT)){// || list.score >= 0) {
    props.relay.finish(scoredTables.tables, scoredTables.score);
    return;
  }
  const batchEnd = Math.max(startT - props.config.size, 0);
  for(let t = startT; t > batchEnd; t--){
    scoredTables = props.stepper(scoredTables, t);
  }


  props.count += 1;

  const rate = props.config.rate;
  const throttled = (props.count % rate);
  if(!throttled){
    const ratio = (props.maxTemperature - batchEnd) / props.maxTemperature;

    // Post the updated lists
    props.relay.update(scoredTables.tables, scoredTables.score, ratio);
  }

  const nextDelay = throttled ? props.delay : props.updateDelay;

  queueNextBatch(scoredTables, batchEnd, props, nextDelay);

}

const makeProps = (relay, stepper, maxTemperature, batchConfig = config) => ({
  relay,
  stepper,
  maxTemperature,
  config: batchConfig,
  count:0,
});

const optimizationRun = (immutableScoredTables, relay, maxTemperature, mode = params.defaultMode) => {

    // Signal the start of a new optimization run
    relay.start();

    const stepper = step(maxTemperature, mode);
    const props = makeProps(relay, stepper, maxTemperature);

    const scoredTables = immutableScoredTables;

    batch(scoredTables, maxTemperature, props);

}

const optimizer = {
  run: optimizationRun,
}

export default optimizer;
