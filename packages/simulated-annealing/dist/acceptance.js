"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metropolisAcceptance = void 0;
const metropolisAcceptance = (energyDelta, temperature) => {
    if (energyDelta < 0)
        return true;
    if (temperature <= 0)
        return false;
    return Math.random() < Math.exp(-energyDelta / temperature);
};
exports.metropolisAcceptance = metropolisAcceptance;
//# sourceMappingURL=acceptance.js.map