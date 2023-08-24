import clc from 'cli-color';
import fs from 'fs';
import path from 'path';
import { formattingRoute } from '../routeFormatter/index.js';

/*

    SPA page generator
    
*/

const singlePageContent = {};

const createSinglePageRoutes = (app, dirname, options) => {
    const viewsFolder = path.join(dirname, 'views');
    console.log(
        clc.cyanBright('[HELIUM] ') +
            clc.bgBlackBright('Creating single page routers')
    );
    parseFolders(app, viewsFolder, options);
};

const parseFolders = (app, dir, options, routePath = '/') => {
    const readingDir = fs.readdirSync(path.join(dir, routePath));

    readingDir.forEach((item) => {
        switch (item) {
            case 'index.html':
                const formattedContent = Buffer.from(
                    formattingRoute(dir, routePath, options)
                ).toString();
                const startHead = formattedContent.indexOf('<head>');
                const endHead = formattedContent.indexOf('</head>');
                const startBody = formattedContent.indexOf('<body>');
                const endBody = formattedContent.indexOf('</body>');

                const routePathSlice = routePath.substring(0, routePath.length - 1);

                singlePageContent[routePathSlice + (routePath == "/" ? "/" : "")] = {
                    pathname: routePath,
                    contentHead: formattedContent.substring(
                        startHead + 6,
                        endHead
                    ),
                    contentBody: formattedContent.substring(
                        startBody + 6,
                        endBody
                    ),
                };
                console.log(
                    clc.cyanBright('[HELIUM] ') +
                        'Created page to be displayed in single page: ' +
                        clc.yellow(routePath)
                );
                break;
            case 'template.html':
                // setupTemplate(dir, routePath);
                break;
            default:
                if (
                    fs.lstatSync(path.join(dir, routePath, item)).isDirectory()
                ) {
                    parseFolders(app, dir, options, `${routePath}${item}/`);
                }
                break;
        }
    });

    app.get('/helium/getSinglePageRoute/', (req, res) => {
        res.status(200).json(singlePageContent);
    });
};

export default createSinglePageRoutes;
