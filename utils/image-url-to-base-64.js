"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertImageUrlsToBase64 = void 0;
const node_fetch_1 = require("node-fetch");
const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
const imageUrlToBase64 = async (url) => {
    if (url.startsWith('data:image'))
        return { url: '', data: `url(${url})` };
    const response = await (0, node_fetch_1.default)(url);
    const dataBuffer = await response.arrayBuffer();
    try {
        const dataBase64 = Buffer.from(dataBuffer).toString('base64');
        return {
            url,
            data: `url(data:${response.headers.get('content-type')};base64,${dataBase64})`,
        };
    }
    catch {
        return { url, data: `url(${url})` };
    }
};
const findImages = (targetWindow) => Array
    .from(targetWindow.document.querySelectorAll('*'))
    .map(async (node) => {
    const prop = targetWindow.getComputedStyle(node, null).getPropertyValue('background-image');
    let match = srcChecker.exec(prop);
    if (match) {
        const image = await imageUrlToBase64(match[1]);
        node.style.backgroundImage = image.data;
    }
    if (/^img$/i.test(node.tagName)) {
        const image = await imageUrlToBase64(node.src);
        node.src = image.data;
    }
}, new Set());
const convertImageUrlsToBase64 = async (targetWindow) => {
    await Promise.all(findImages(targetWindow));
    return targetWindow;
};
exports.convertImageUrlsToBase64 = convertImageUrlsToBase64;
//# sourceMappingURL=image-url-to-base-64.js.map