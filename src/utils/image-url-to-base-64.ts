import fetch from 'node-fetch';
import { DOMWindow } from "jsdom";

const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;

const imageUrlToBase64 = async (url: string) => {
    if (url.startsWith('data:image')) return { url: '', data: `url(${url})`};

    const response = await fetch(url);
    const dataBuffer = await response.arrayBuffer();

    try {
        const dataBase64 = Buffer.from(dataBuffer).toString('base64')

        return {
            url,
            data: `url(data:${response.headers.get('content-type')};base64,${dataBase64})`,
        };
    } catch {
        return { url, data: `url(${url})`};
    }
}

const findImages = (targetWindow: DOMWindow | Window) => Array
    .from(targetWindow.document.querySelectorAll('*'))
    .map(async node => {
        const prop = targetWindow.getComputedStyle(node, null).getPropertyValue('background-image');

        let match = srcChecker.exec(prop)
        if (match) {
            const image = await imageUrlToBase64(match[1]);
            (node as HTMLElement).style.backgroundImage = image.data;
        }
        
        if (/^img$/i.test(node.tagName)) {
            const image = await imageUrlToBase64((node as HTMLImageElement).src);
            (node as HTMLImageElement).src = image.data;
        }
    }, new Set<string>())

export const convertImageUrlsToBase64 = async (targetWindow: DOMWindow) => {
    await Promise.all(findImages(targetWindow));
    return targetWindow;
}