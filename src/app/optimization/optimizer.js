import { setVenueGuests, scoreVenue, startOptimization, endOptimization } from '../../app/action_creators';

import anneal from './annealing';
import * as params from '../../data/venue.js';
import {config} from './const.js';

const opimizationDispatchRelay = (dispatch) => ({
  start: () => dispatch(startOptimization()),
  update: (list, ratio) => dispatch(setVenueGuests(list, ratio)),
  finish: (list) => {
    dispatch(setVenueGuests(list, 1));
    dispatch(endOptimization());
    dispatch(scoreVenue());
  },
});


const step = (tableSize, maxTemperature, mode) => (list, currentTemperature) => {
  return anneal(list, tableSize, currentTemperature, maxTemperature, mode);
}

const isFrozen = (t) => t < 1;

const queueNextBatch = (list, t, props, delay) => (
  setTimeout(() => {
    batch(list, t, props)
  }), delay);

const batch = (list, startT, props) => {
  if(isFrozen(startT)){// || list.score >= 0) {
    props.relay.finish(list.guests);
    return;
  }
  const batchEnd = Math.max(startT - props.config.size, 0);
  for(let t = startT; t > batchEnd; t--){
    list = props.stepper(list, t);
  }


  props.count += 1;

  const rate = props.config.rate;
  const throttled = (props.count % rate);
  if(!throttled){
    const ratio = (props.maxTemperature - batchEnd) / props.maxTemperature;

    // Post the updated lists
    props.relay.update(list.guests, ratio);
  }

  const nextDelay = throttled ? props.delay : props.updateDelay;

  queueNextBatch(list, batchEnd, props, nextDelay);

}

const makeProps = (relay, stepper, maxTemperature, batchConfig = config) => ({
  relay,
  stepper,
  maxTemperature,
  config: batchConfig,
  count:0,
});

const optimizationRun = (scoredList, relay, maxTemperature, tableSize, mode = 'hate') => {

    // Signal the start of a new optimization run
    relay.start();

    const stepper = step(tableSize, maxTemperature, mode);
    const props = makeProps(relay, stepper, maxTemperature);

    batch(scoredList, maxTemperature, props);

}

const optimizer = {
  run: optimizationRun,
}

export default optimizer;
