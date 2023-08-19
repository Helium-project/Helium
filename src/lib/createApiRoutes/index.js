const clc = require('cli-color');
const fs = require('fs');
const path = require('path');
const { formattingRoute, setupTemplate } = require('../routeFormatter');

const createApiRoutes = (app, dirname) => {
  const apiFolder = path.join(dirname, 'api');
  console.log(
    clc.cyanBright('[HELIUM] ') + clc.bgBlackBright('Creating api routers')
  );
  parseFolders(app, apiFolder);
};

const parseFolders = (app, dir, routePath = '/') => {
  const readingDir = fs.readdirSync(path.join(dir, routePath));

  readingDir.forEach((item) => {
    switch (item) {
      case 'index.js':
        createApi(app, dir, routePath);
        console.log(
          clc.cyanBright('[HELIUM] ') +
            'Created api route: ' +
            clc.yellow("/api" + routePath)
        );
        break;
      default:
        if (fs.lstatSync(path.join(dir, routePath, item)).isDirectory()) {
          parseFolders(app, dir, `${routePath}${item}/`);
        }
        break;
    }
  });
};

const createApi = (app, dir, routePath = '/') => {
  const {type, action} = require(path.join(dir, routePath, "index.js"));

  if (type == "GET") {
    app.get("/api" + routePath, (req, res) => {
      action(req, res);
    });
  } else if (type == "POST") {
    app.post("/api" + routePath, (req, res) => {
      action(req, res);
    });
  } else {
    console.log(
      clc.cyanBright('[HELIUM] ') +
        clc.bgYellow('[WARNING]') +
        ' The GET/POST request type of route is not specified: * ' +
        clc.yellow(routePath)
    );
  }
};

module.exports = {
  createApiRoutes: createApiRoutes,
};
