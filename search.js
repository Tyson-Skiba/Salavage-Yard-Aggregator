"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const data_sources_1 = require("./data-sources");
const generate_1 = require("./generate");
const shouldPrint = process.argv.slice(2)[0] === '--print';
const picklesData = new data_sources_1.Pickles();
const manheimData = new data_sources_1.Manheim();
const getAll = async (...dataSources) => {
    const searches = dataSources.map(source => source.read());
    const searchResults = await Promise.all(searches);
    return searchResults.flatMap(results => results);
};
console.log('Reading from sources');
getAll(picklesData, manheimData)
    .then(results => {
    console.log('Found some data');
    results.forEach(result => {
        console.log(result.url);
    });
    if (shouldPrint) {
        console.log('Generating static output');
        (0, generate_1.generatePage)(results).then(_ => { console.log('Done'); });
    }
    else {
        console.log('Starting display app');
        (0, server_1.startServer)(results, 3002);
    }
});
//# sourceMappingURL=search.js.map