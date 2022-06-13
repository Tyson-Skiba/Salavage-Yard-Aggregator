import { startServer } from './server';
import { Pickles, Manheim, IListing, IDataSource } from './data-sources';
import { generatePage } from './generate';

const shouldPrint = process.argv.slice(2)[0] === '--print';

const picklesData = new Pickles();
const manheimData = new Manheim();

const getAll = async (...dataSources: IDataSource[]): Promise<IListing[]> => {
    const searches = dataSources.map(source => source.read());
    
    const searchResults = await Promise.all(searches);
    return searchResults.flatMap(results => results);
}

console.log('Reading from sources');

getAll(picklesData, manheimData)
    .then(results => {
        console.log('Found some data');
        results.forEach(result => {
            console.log(result.url);
        })

        if (shouldPrint) {
            console.log('Generating static output');
            generatePage(results).then(_ => { console.log('Done') });
        } else {
            console.log('Starting display app');
            startServer(results, 3002);
        }
    })
