const clc = require("cli-color");
const express = require('express');
const { createStaticRoutes } = require('./lib/createStaticRoutes');
const app = express()

const startApp = (port, dirname, callbacks) => {
    app.listen(port, () => {
        console.log(clc.cyanBright("[HELIUM] ") + `Launching the Helium application`);
        createStaticRoutes(app, dirname);
        console.log(clc.cyanBright("[HELIUM] ") + `Helium application is up and running and available at: ${clc.yellow(`http://localhost:${port}`)}`);
        if (typeof callbacks == "function") {
            callbacks();
        }
    })
}

module.exports = {
    startApp: startApp,
}