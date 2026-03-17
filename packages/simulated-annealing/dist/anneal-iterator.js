"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annealIterator = annealIterator;
const acceptance_1 = require("./acceptance");
function* annealIterator(initialState, initialEnergy, config) {
    var _a;
    const accept = (_a = config.acceptance) !== null && _a !== void 0 ? _a : acceptance_1.metropolisAcceptance;
    let state = initialState;
    let energy = initialEnergy;
    let bestState = initialState;
    let bestEnergy = initialEnergy;
    let temperature = config.initialTemperature;
    let step = 0;
    while (temperature > 0 && (config.maxSteps === undefined || step < config.maxSteps)) {
        const transition = config.neighbor(state, temperature);
        if (transition !== null && accept(transition.energyDelta, temperature)) {
            state = transition.nextState;
            energy += transition.energyDelta;
            if (energy < bestEnergy) {
                bestEnergy = energy;
                bestState = state;
            }
        }
        temperature = config.coolingSchedule(temperature, step);
        step++;
        yield { state, energy, temperature, step, bestState, bestEnergy };
    }
}
//# sourceMappingURL=anneal-iterator.js.map