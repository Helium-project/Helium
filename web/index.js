import clc from 'cli-color';
import express from 'express';
import fs from 'fs';
import path from 'path';
import createStaticRoutes from './lib/createStaticRoutes/index.js';
import createApiRoutes from './lib/createApiRoutes/index.js';
import createSinglePageRoutes from './lib/createSinglePageRoutes/index.js';
import { buildAll } from './lib/buildAll/index.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const defaultOptions = {
    spa: false,
    useBuild: true,
}

export const startApp = (port, dirname, options = defaultOptions, callbacks) => {
    fs.existsSync(path.join(__dirname, '../.build/')) ? fs.rmdirSync(path.join(__dirname, '../.build/'), { force: true, recursive: true }) : undefined;
    fs.mkdirSync(path.join(__dirname, '../.build/'));
    
    app.listen(port, () => {
        console.log(clc.cyanBright("[HELIUM] ") + `Launching the Helium application`);
        app.use('/public', express.static(dirname + '/public'));
        options.useBuild ? buildAll(app, dirname, options) : undefined;
        if (options.useBuild) {
            createStaticRoutes(app, path.join(__dirname, "../.build/"), options);
            options.spa ? createSinglePageRoutes(app, path.join(__dirname, "../.build/"), options) : undefined;
        } else {
            createStaticRoutes(app, dirname, options);
            options.spa ? createSinglePageRoutes(app, dirname, options) : undefined;
        }
        createApiRoutes(app, dirname);
        console.log(clc.cyanBright("[HELIUM] ") + `Helium application is up and running and available at: ${clc.yellow(`http://localhost:${port}`)}`);
        if (typeof callbacks == "function") {
            callbacks();
        }
    })
}