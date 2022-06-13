import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { DataSource, IListing } from './base';

interface MenheimOptions {
    includeSalvage?: boolean;
}

const asArray = (data: NodeListOf<HTMLElement>) => {
    const arr: HTMLElement[] = [];
    data.forEach(item => arr.push(item));
    return arr;
} 

const findByKey = (key: string, data: HTMLElement[], parent: Element) => {
    const index = data.findIndex(item => item.innerHTML === key);
    return index === -1
        ? ''
        : parent.querySelectorAll('dd')[index]?.innerHTML ?? '';
}

export class Manheim extends DataSource {
    private readonly _includeSalvage: boolean;

    constructor(opts?: MenheimOptions) {
        super();
        this._includeSalvage = opts?.includeSalvage;
    }

    public readAll = async () => {
        const response = await fetch('https://www.manheim.com.au/damaged-vehicles/publicsearch/resultpartial?unrefine=Keywords&refineName=EngineType&ManufacturerCode=FORD&ManufacturerCodeDescription=Ford&EngineType=8%20Cyl%2C%205.4L%2C%20Injection&EngineTypeDescription=8%20Cyl%2C%205.4L%2C%20Injection&_=1654932808707');
        const data: string = await response.text();

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(data, 'text/html');
        const dom = new JSDOM(data);
        const doc = dom.window.document;
    
        const vehicles = doc.querySelectorAll('.vehicle-card');

        const final = [] as IListing[];

        vehicles.forEach((vehicle: HTMLElement) => {
            const header = vehicle.querySelector('.card-header');
            const content = vehicle.querySelector('.card-content');
            const details = vehicle.querySelector('.card-content .details');
            const detailItems = asArray(details.querySelectorAll('dt'));

            final.push({
                title: header.querySelector('h2')?.innerHTML ?? '',
                url: 'https://www.manheim.com.au' + header.querySelector('a')?.href ?? '',
                tileImage: (content.querySelector('a img') as HTMLImageElement)?.src ?? '',
                bodyType: findByKey('Body', detailItems, details),
                location: '',
                colour: findByKey('Colour', detailItems, details),
                vin: '',
                detail: `${ findByKey('Transmission', detailItems, details) }, ${ findByKey('Engine', detailItems, details) }, ${ findByKey('WOVR', detailItems, details) }`,
                mileage: findByKey('Odometer', detailItems, details),
                seller: 'Manehim',
                sellerType: 'Salavage',
                sellerLogo: 'https://images-na.ssl-images-amazon.com/images/I/71P9jC52p+L.png',
            })
        });
        
        return final;
    }

}