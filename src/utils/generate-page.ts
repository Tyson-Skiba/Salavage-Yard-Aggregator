import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { JSDOM } from 'jsdom';

import { helpers } from '../templates/helpers';
import { convertImageUrlsToBase64 } from '../utils';

export class PageGenerator<T> {
    private readonly search_result: T[];
    private readonly rootDir: string;

    constructor(data: T[]) {
        this.search_result = data;
        this.rootDir = path.join(__dirname, '..');
    }

    private applyTemplate = <C extends Record<string, unknown>>(templatePath: string, context: C, options?: RuntimeOptions) => {
        const template: string = fs.readFileSync(templatePath, 'utf8');
    
        const compiled = handlebars.compile(template);
        return compiled(context, options);
    }

    private injectStylesInline = async (html: string) => {
        const dom = new JSDOM(html);
        const content = fs.readFileSync(`${this.rootDir}/server/static/styles.css`, 'utf8');
      
        const head = dom.window.document.head;
        const style = dom.window.document.createElement('style');
      
        style.innerHTML = content;
      
        head.appendChild(style);

        const win = await convertImageUrlsToBase64(dom.window);

        return dom.serialize();
    }

    public getPage = async () => {
        const { search_result, rootDir } = this;
        const body = this.applyTemplate(`${rootDir}/templates/views/results.handlebars`, { search_result }, { helpers });
        const html = this.applyTemplate(`${rootDir}/templates/views/layouts/main.handlebars`, { body }, { helpers });
    
        // TODO: Use layout (main) and inject css
        return this.injectStylesInline(html);
    }

    public writeToDisk = async () => {
        const { rootDir } = this;
        fs.writeFileSync(`${rootDir}/results.html`, await this.getPage());
    }
}
