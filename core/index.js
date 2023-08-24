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
import watchChanges from './lib/watchChanges/index.js';
import store from './store/index.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Standard config
const defaultOptions = {
    spa: true, // Single Page Application, it is recommended to use without using third-party libraries such as React
    useBuild: true, // Each index.js file will be compiled via esbuild, allowing you to create more complex applications
    changeFileLog: true, // Notify the console about file changes, will only work if useBuild is enabled
}

// Launching the Helium app
export const startApp = (port, dirname, options = defaultOptions, callbacks) => {
    // Build folder check
    fs.existsSync(path.join(__dirname, '../.build/')) ? fs.rmdirSync(path.join(__dirname, '../.build/'), { force: true, recursive: true }) : undefined;
    fs.mkdirSync(path.join(__dirname, '../.build/'));

    // Global Store Configuration
    store.setOptions(options);
    store.setProjectDir(dirname);
    store.setBuildDir(path.join(__dirname, '../.build/'));
    
    // Starting the Express server
    app.listen(port, () => {
        console.log(clc.cyanBright("[HELIUM] ") + `Launching the Helium application`);
        app.use('/public', express.static(dirname + '/public'));
        options.useBuild ? buildAll(app) : undefined;
        if (options.useBuild) {
            createStaticRoutes(app, store.getBuildDir(), options);
            options.spa ? createSinglePageRoutes(app, store.getBuildDir(), options) : undefined;
            watchChanges(app);
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