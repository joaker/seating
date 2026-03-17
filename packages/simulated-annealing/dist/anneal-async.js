"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annealAsync = annealAsync;
const acceptance_1 = require("./acceptance");
function annealAsync(initialState, initialEnergy, config, batchConfig) {
    var _a;
    const accept = (_a = config.acceptance) !== null && _a !== void 0 ? _a : acceptance_1.metropolisAcceptance;
    let state = initialState;
    let energy = initialEnergy;
    let bestState = initialState;
    let bestEnergy = initialEnergy;
    let temperature = config.initialTemperature;
    let step = 0;
    return new Promise((resolve) => {
        function runBatch() {
            const batchEnd = Math.max(temperature - batchConfig.batchSize, 0);
            while (temperature > batchEnd) {
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
                if (config.maxSteps !== undefined && step >= config.maxSteps) {
                    const snapshot = { state, energy, temperature, step, bestState, bestEnergy };
                    batchConfig.onProgress(snapshot);
                    resolve(snapshot);
                    return;
                }
            }
            const snapshot = { state, energy, temperature, step, bestState, bestEnergy };
            batchConfig.onProgress(snapshot);
            if (temperature <= 0) {
                resolve(snapshot);
                return;
            }
            setTimeout(runBatch, 0);
        }
        setTimeout(runBatch, 0);
    });
}
//# sourceMappingURL=anneal-async.js.map