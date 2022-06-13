"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGenerator = void 0;
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const jsdom_1 = require("jsdom");
const helpers_1 = require("../templates/helpers");
const utils_1 = require("../utils");
class PageGenerator {
    constructor(data) {
        this.applyTemplate = (templatePath, context, options) => {
            const template = fs.readFileSync(templatePath, 'utf8');
            const compiled = handlebars.compile(template);
            return compiled(context, options);
        };
        this.injectStylesInline = async (html) => {
            const dom = new jsdom_1.JSDOM(html);
            const content = fs.readFileSync(`${this.rootDir}/server/static/styles.css`, 'utf8');
            const head = dom.window.document.head;
            const style = dom.window.document.createElement('style');
            style.innerHTML = content;
            head.appendChild(style);
            const win = await (0, utils_1.convertImageUrlsToBase64)(dom.window);
            return dom.serialize();
        };
        this.getPage = async () => {
            const { search_result, rootDir } = this;
            const body = this.applyTemplate(`${rootDir}/templates/views/results.handlebars`, { search_result }, { helpers: helpers_1.helpers });
            const html = this.applyTemplate(`${rootDir}/templates/views/layouts/main.handlebars`, { body }, { helpers: helpers_1.helpers });
            return this.injectStylesInline(html);
        };
        this.writeToDisk = async () => {
            const { rootDir } = this;
            fs.writeFileSync(`${rootDir}/results.html`, await this.getPage());
        };
        this.search_result = data;
        this.rootDir = path.join(__dirname, '..');
    }
}
exports.PageGenerator = PageGenerator;
//# sourceMappingURL=generate-page.js.map