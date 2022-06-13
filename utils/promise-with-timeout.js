"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureWithTimeout = void 0;
const ConfigureWithTimeout = (promise, timeout) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        promise
            .then(value => {
            clearTimeout(timer);
            resolve(value);
        })
            .catch(error => {
            clearTimeout(timer);
            reject(error);
        });
    });
};
exports.ConfigureWithTimeout = ConfigureWithTimeout;
//# sourceMappingURL=promise-with-timeout.js.map