import { ConfigureWithTimeout } from "../utils";

export interface IListing {
    title: string;
    url: string;
    tileImage: string;
    bodyType: string;
    location: string;
    colour: string;
    detail: string;
    mileage: string;
    vin: string;
    seller: string;
    sellerType: string;
    sellerLogo: string;
}

export interface IDataSource {
    readAll: () => Promise<IListing[]>;
    read: () => Promise<IListing[]>;
}

export class DataSource implements IDataSource {
    readAll = (): Promise<IListing[]> => {
        throw new Error("Overwrite me");
    }

    public read = async () => {
        return ConfigureWithTimeout(this.readAll(), 60000);
    }
}
