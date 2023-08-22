import clc from 'cli-color';
import fs from 'fs'; 
import path from 'path';
import { pathToFileURL } from 'url';

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
      case 'api.js':
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

const createApi = async (app, dir, routePath = '/') => {
  const apiRoute = await import(pathToFileURL(path.join(dir, routePath, "api.js")));

  if (apiRoute.default.type == "GET") {
    app.get("/api" + routePath, (req, res) => {
      apiRoute.default.action(req, res);
    });
  } else if (apiRoute.default.type == "POST") {
    app.post("/api" + routePath, (req, res) => {
      apiRoute.default.action(req, res);
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

export default createApiRoutes;
