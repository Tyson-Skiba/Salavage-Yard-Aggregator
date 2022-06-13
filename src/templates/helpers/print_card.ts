import { IListing } from '../../data-sources';

const openInTabGenerator = (url: string) => `(function() { window.open('${ url }', '_blank').focus(); })()`;

export const print_card = ({
    url,
    title,
    bodyType,
    detail,
    mileage,
    tileImage,
    seller,
    sellerType,
    sellerLogo,
}: IListing) => {

    return `
        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="bg-cover bg-center h-56 p-4" style="background-image: url(${ tileImage })">
                <div class="flex justify-end">
                    <svg class="h-6 w-6 text-white fill-current hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12.76 3.76a6 6 0 0 1 8.48 8.48l-8.53 8.54a1 1 0 0 1-1.42 0l-8.53-8.54a6 6 0 0 1 8.48-8.48l.76.75.76-.75zm7.07 7.07a4 4 0 1 0-5.66-5.66l-1.46 1.47a1 1 0 0 1-1.42 0L9.83 5.17a4 4 0 1 0-5.66 5.66L12 18.66l7.83-7.83z"></path>
                    </svg>
                </div>
            </div>
            <div class="p-4">
                <p class="uppercase tracking-wide text-sm font-bold text-gray-700">${ bodyType } • ${ mileage || '' }</p>
                <p class="text-gray-700 truncate">${ title } </p>
            </div>
            <div class="min-h-[6.5rem] max-h-[6.5rem] p-4 border-t border-gray-300 text-gray-700">
                ${ detail }
            </div>
            <div class="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100 hover:bg-gray-50 cursor-pointer" onclick="${ openInTabGenerator(url) }">
                <div class="text-xs uppercase font-bold text-gray-600 tracking-wide">Seller</div>
                <div class="flex items-center pt-2">
                    <div class="bg-cover bg-center w-10 h-10 mr-3" style="background-image: url(${ sellerLogo })">
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">${ seller }</p>
                        <p class="text-sm text-gray-700">${ sellerType } </p>
                    </div>
                </div>
            </div>
        </div>
`;
}
