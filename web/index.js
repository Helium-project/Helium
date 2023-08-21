import clc from 'cli-color';
import express from 'express';
import path from 'path';
import createStaticRoutes from './lib/createStaticRoutes/index.js';
import createApiRoutes from './lib/createApiRoutes/index.js';
import createSinglePageRoutes from './lib/createSinglePageRoutes/index.js';
const app = express();

const defaultOptions = {
    spa: false,
}

export const startApp = (port, dirname, options = defaultOptions, callbacks) => {
    app.listen(port, () => {
        console.log(clc.cyanBright("[HELIUM] ") + `Launching the Helium application`);
        app.use('/public', express.static(dirname + '/public'));
        createStaticRoutes(app, dirname, options);
        options.spa ? createSinglePageRoutes(app, dirname, options) : undefined;
        createApiRoutes(app, dirname);
        console.log(clc.cyanBright("[HELIUM] ") + `Helium application is up and running and available at: ${clc.yellow(`http://localhost:${port}`)}`);
        if (typeof callbacks == "function") {
            callbacks();
        }
    })
}