"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manheim = void 0;
const node_fetch_1 = require("node-fetch");
const jsdom_1 = require("jsdom");
const base_1 = require("./base");
const asArray = (data) => {
    const arr = [];
    data.forEach(item => arr.push(item));
    return arr;
};
const findByKey = (key, data, parent) => {
    var _a, _b;
    const index = data.findIndex(item => item.innerHTML === key);
    return index === -1
        ? ''
        : (_b = (_a = parent.querySelectorAll('dd')[index]) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : '';
};
class Manheim extends base_1.DataSource {
    constructor(opts) {
        super();
        this.readAll = async () => {
            const response = await (0, node_fetch_1.default)('https://www.manheim.com.au/damaged-vehicles/publicsearch/resultpartial?unrefine=Keywords&refineName=EngineType&ManufacturerCode=FORD&ManufacturerCodeDescription=Ford&EngineType=8%20Cyl%2C%205.4L%2C%20Injection&EngineTypeDescription=8%20Cyl%2C%205.4L%2C%20Injection&_=1654932808707');
            const data = await response.text();
            const dom = new jsdom_1.JSDOM(data);
            const doc = dom.window.document;
            const vehicles = doc.querySelectorAll('.vehicle-card');
            const final = [];
            vehicles.forEach((vehicle) => {
                var _a, _b, _c, _d, _e, _f;
                const header = vehicle.querySelector('.card-header');
                const content = vehicle.querySelector('.card-content');
                const details = vehicle.querySelector('.card-content .details');
                const detailItems = asArray(details.querySelectorAll('dt'));
                final.push({
                    title: (_b = (_a = header.querySelector('h2')) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : '',
                    url: (_d = 'https://www.manheim.com.au' + ((_c = header.querySelector('a')) === null || _c === void 0 ? void 0 : _c.href)) !== null && _d !== void 0 ? _d : '',
                    tileImage: (_f = (_e = content.querySelector('a img')) === null || _e === void 0 ? void 0 : _e.src) !== null && _f !== void 0 ? _f : '',
                    bodyType: findByKey('Body', detailItems, details),
                    location: '',
                    colour: findByKey('Colour', detailItems, details),
                    vin: '',
                    detail: `${findByKey('Transmission', detailItems, details)}, ${findByKey('Engine', detailItems, details)}, ${findByKey('WOVR', detailItems, details)}`,
                    mileage: findByKey('Odometer', detailItems, details),
                    seller: 'Manehim',
                    sellerType: 'Salavage',
                    sellerLogo: 'https://images-na.ssl-images-amazon.com/images/I/71P9jC52p+L.png',
                });
            });
            return final;
        };
        this._includeSalvage = opts === null || opts === void 0 ? void 0 : opts.includeSalvage;
    }
}
exports.Manheim = Manheim;
//# sourceMappingURL=manheim.js.map