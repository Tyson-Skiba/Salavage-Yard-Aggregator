"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSource = void 0;
const utils_1 = require("../utils");
class DataSource {
    constructor() {
        this.readAll = () => {
            throw new Error("Overwrite me");
        };
        this.read = async () => {
            return (0, utils_1.ConfigureWithTimeout)(this.readAll(), 60000);
        };
    }
}
exports.DataSource = DataSource;
//# sourceMappingURL=base.js.map