"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linearCooling = linearCooling;
exports.geometricCooling = geometricCooling;
exports.logarithmicCooling = logarithmicCooling;
function linearCooling(rate = 1) {
    return (temperature) => temperature - rate;
}
function geometricCooling(alpha = 0.99) {
    return (temperature) => temperature * alpha;
}
function logarithmicCooling(c = 1) {
    return (temperature, step) => c / Math.log(1 + step);
}
//# sourceMappingURL=cooling.js.map