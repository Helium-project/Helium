import clc from 'cli-color';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/*

    Generating pages from a template

*/

let templateSource = '';

export const formattingRoute = (dir, routePath, options = {}) => {
    const indexFilePath = path.join(dir, routePath, 'index.html');
    const fileSource = fs.readFileSync(indexFilePath);
    const fileSourceText = Buffer.from(fileSource).toString();
    const spaFilePath = path.join(
        __dirname, '../createSinglePageRoutes/lib/spaScript/index.js'
    );
    const spaSource = fs.readFileSync(spaFilePath);
    const spaSourceText = Buffer.from(spaSource).toString();

    const startHead = fileSourceText.indexOf('<head>');
    const endHead = fileSourceText.indexOf('</head>');
    const startBody = fileSourceText.indexOf('<body>');
    const endBody = fileSourceText.indexOf('</body>');

    let pageContent = templateSource;

    options.spa
        ? (pageContent = pageContent.replace(
              '%HEAD%',
              '%HEAD%\n<script type="text/javascript">' + spaSourceText + '</script>'
          ))
        : undefined;

    if (startHead !== -1 && endHead !== -1) {
        const extractedText = fileSourceText.substring(startHead + 6, endHead);
        pageContent = pageContent.replace('%HEAD%', extractedText);
    } else {
        console.log(
            clc.cyanBright('[HELIUM] ') +
                clc.bgYellow('[WARNING]') +
                ' The <head> tag were not found. by route: ' +
                clc.yellow(routePath)
        );
        pageContent = pageContent.replace('%HEAD%', '');
    }

    if (startBody !== -1 && endBody !== -1) {
        const extractedText = fileSourceText.substring(startBody + 6, endBody);
        pageContent = pageContent.replace('%BODY%', extractedText);
    } else {
        console.log(
            clc.cyanBright('[HELIUM] ') +
                clc.bgYellow('[WARNING]') +
                ' The <body> tag were not found. by route: ' +
                clc.yellow(routePath)
        );
        pageContent = pageContent.replace('%BODY%', '');
    }

    return Buffer.from(pageContent);
};

export const setupTemplate = (dir, routePath) => {
    const templateFilePath = path.join(dir, routePath, 'template.html');
    const fileSource = fs.readFileSync(templateFilePath);
    templateSource = Buffer.from(fileSource).toString();
};
