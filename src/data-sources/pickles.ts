import fetch from 'node-fetch';
import { DataSource, IListing } from './base';

interface PicklesOptions {
    includeSalvage?: boolean;
}

export class Pickles extends DataSource {
    private readonly _includeSalvage: boolean;

    constructor(opts?: PicklesOptions) {
        super();
        this._includeSalvage = opts?.includeSalvage;
    }

    public readAll = async () => {
        const response = await fetch('https://www.pickles.com.au/v4/caradvert/salvage-public?count=true&q=(And.ProductType.Vehicles._.Cylinders.8+Cylinders._.(Or.(C.Make.Ford._.Model.Falcon.)_.Make.Ford+Performance+Vehicles.))&sr=%7CDefault%7C0%7C120');
        const data: any = await response.json();
    
        return data.SearchResults.map((listing: any): IListing => ({
            title: listing?.Title ?? '',
            tileImage: `https://images.pickles.com.au/image/upload/f_auto,q_auto,w_768/c_scale,g_south_east,l_pickles-logo-white_mipoap,o_60,w_0.5,fl_relative,x_0.02,y_0.02,fl_region_relative/v1654638764/${ listing.Thumbnails?.length ? listing.Thumbnails[0] : '' }.jpg`,
            bodyType: listing.Body,
            location: listing.BranchName,
            colour: listing.Colour,
            detail: listing.FullDescription,
            mileage: listing.Kilometres,
            vin: listing.VIN,
            url: 'https://www.pickles.com.au/damaged-salvage/item/-/details/' + listing.Title?.replace(/\//g, '-').replace(/,/g, '--') + '/' + listing.TargetId,
            seller: 'Pickles',
            sellerType: 'Salavage',
            sellerLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAeFBMVEX///8AT5T1+PsUXZzp7fPb4uujwNg9ea43cad3m8Apa6Xv8fVumcD5+vwhYJ0DUZUKVZd9pchIgbKevNZjjrmHrM22yt5BfK8kaKNbibbM3OqjutTi6PGQstCEpce6zN+vyN2ZudTA1OWSr810mb9ei7fT3+qCqcu/OIhVAAAElklEQVR4nO2d23arIBBAjbdYL4HYNGq0zd3z/394TCsqBIwpRGZ1sZ/SPJi9EEGGYWpZFO5hfc2Wo4TPEoxfj6JYbyNLiO2neKEdnPo2Vy/xQ91uhPzIUaxSpNtrQLBj/fYr3U40+Ej7vQPofDRoTflBur2EgeGeaj9cfG49DezPBeWBurtcDfofCspEPBC9muSwHLZU+6Qkaf/dSqfeN9u8twl+RptD3wGzSrNeQ7TpDT9vXyRB9/eGP4TPTPLVtdjqNu+dECy/hi+qCbsWzaD4WUnnFCSW7bSfHQD9jxCRJwV51onInnVbDdmTfvdufbSfct3jC03WasVWCrEBmyZstVKrnUWQq1uJJmm9Aqt9Rpa6jVjaBzkkgl+6hViO7VBNBLe6hVja0cUhgoAGwR88RhDYM9IsgI2gJEZQFiMoixGUxQjKYgRliaAL2kZQkj8jaNcHXx11ZU9dfk8T3G1IYEQVKF/GpTfBcopgtHlR6Brl8e6R4wTBaCn+CXmCcjyY9lgwKV7p1xD6Y634WNB/sV9DVksIJrn4wspwjjy3oSAWCp7El1XJRnSbW8GFUPBtHsHFUrA//FAwE15SMQF/CH4oGAivqJqM24aABBcFrx9CElx8QBfEJ+CCZNcQriBnjwGYoHP3+8AE74P40AQdthdCE1yU0AUz6ILYBS648JUIri5vMlxG0utiJYLSe47Rm2ilGMAQtKxSYMgMNPoEBzkdFJjeLtQo6PKjFYh+pdEoaAkW3PSOsE7BtRGUBPotBv+QCEICYIYZ4AN1Fc841XnlOt5sNvETLGd8WagKtbnXB8WCnuLUdcxEaKQFVQewFb3yd4JbxX6qFk2doOoIu8NGuCQFE9UbPKoW7kTQU7zFoyz0QQRVd0FlwSMiWKr1Uxd+I4JnpX4KA5hEULDw+SW8DGRIgleFQfRXCPLPEEgKHtX5qd3IIYIHZX78bRwwAzUSnmGRnerUvGxh8REq2ZeFiwq/CRvavxas5F+n8ykpAb9/YRUtziby8Pye/Jrk8PtuiPPL3elX9YJWVF7DlfMMGDvOKovLenpij+y6OImewa2iZ1OjtASP/oggAi5IpgIjaASNoBE0gkZwVsEUjmDKFXyDI8iPHbCBWo2CO54fmzuiUzDhJbHGvEtpErSq+0TqYKSi0/yClntlVpbFjH5TBJtGPKcORo0mQji8jIQBdAneiLz6tK+92euATBbUhRGUxQjKYgRlMYKyGEFZjKAsRlCWBAMXZIPonKwBvXiMILiyVj4jyOZ2aSdmBNnsOO20DzHu0uzEJ321QIrThV3WdQirvB+JXRV9FtZ8caEJdAUSP62IbJ2DKjFJKk+jehAIhFik89bx+moAMZRu2Mcmbwd77T6KdQFhOCgU+5P3OKj1nAKYkoeldn8qPtuDjGP9xYr3g8rseTt71IOMWRQ+qMHxUpL9sDJ7n/foU5FKnJ63tee5DfaMuPV7TGe6DI6+fwAsOY6ogDhAQ2bQg1ZWHt+VNtjNfhx2jJyXF3wE878DnDX/7dR+zyB0xfzfyHTh+nEafKeM6VBDTlh8MuWa/gNWQWMOLwaXZAAAAABJRU5ErkJggg==',
        }));
    }
}