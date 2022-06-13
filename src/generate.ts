import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { JSDOM } from 'jsdom';

import { IListing } from './data-sources';
import { helpers } from './templates/helpers';
import { PageGenerator } from './utils'

const injectStylesInline = (html: string) => {
    const dom = new JSDOM(html);
    const content = fs.readFileSync(`${__dirname}/server/static/styles.css`, 'utf8');
  
    const head = dom.window.document.head;
    const style = dom.window.document.createElement('style');
  
    style.innerHTML = content;
  
    head.appendChild(style);

    return dom.serialize();
}

const applyTemplate = <T extends Record<string, unknown>>(templatePath: string, context: T, options?: RuntimeOptions) => {
    const template: string = fs.readFileSync(templatePath, 'utf8');

    const compiled = handlebars.compile(template);
    return compiled(context, options);
}

export const generatePage = async (search_result: IListing[]) => {
    const generator = new PageGenerator(search_result);
    await generator.writeToDisk();
}