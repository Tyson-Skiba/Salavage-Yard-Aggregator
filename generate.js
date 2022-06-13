"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePage = void 0;
const fs = require("fs");
const handlebars = require("handlebars");
const jsdom_1 = require("jsdom");
const utils_1 = require("./utils");
const injectStylesInline = (html) => {
    const dom = new jsdom_1.JSDOM(html);
    const content = fs.readFileSync(`${__dirname}/server/static/styles.css`, 'utf8');
    const head = dom.window.document.head;
    const style = dom.window.document.createElement('style');
    style.innerHTML = content;
    head.appendChild(style);
    return dom.serialize();
};
const applyTemplate = (templatePath, context, options) => {
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiled = handlebars.compile(template);
    return compiled(context, options);
};
const generatePage = async (search_result) => {
    const generator = new utils_1.PageGenerator(search_result);
    await generator.writeToDisk();
};
exports.generatePage = generatePage;
//# sourceMappingURL=generate.js.map