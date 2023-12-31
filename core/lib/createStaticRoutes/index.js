import clc from 'cli-color';
import fs from 'fs'; 
import path from 'path';
import { formattingRoute, setupTemplate } from '../routeFormatter/index.js';

/*

  Responsible for intuitive routing

*/

const createStaticRoutes = (app, dirname, options = {}) => {
  console.log(dirname);
  const viewsFolder = path.join(dirname, 'views');
  console.log(
    clc.cyanBright('[HELIUM] ') + clc.bgBlackBright('Creating static routers')
  );
  parseFolders(app, viewsFolder, options);
};

const parseFolders = (app, dir, options, routePath = '/') => {
  const readingDir = fs.readdirSync(path.join(dir, routePath));

  readingDir.forEach((item) => {
    switch (item) {
      case 'index.html':
        app.get(routePath, (req, res) => {
          res.set('Content-Type', 'text/html')
          res.send(formattingRoute(dir, routePath, options))
        });
        console.log(
          clc.cyanBright('[HELIUM] ') +
            'Created static route: ' +
            clc.yellow(routePath)
        );
        break;
      case 'template.html':
        setupTemplate(dir, routePath);
        break;
      default:
        if (fs.lstatSync(path.join(dir, routePath, item)).isDirectory() ) {
          parseFolders(app, dir, options, `${routePath}${item}/`);
        } else {
          app.get(routePath + item, (req, res) => {
            res.sendFile(path.join(dir, routePath, item))
          });
          console.log(
            clc.cyanBright('[HELIUM] ') +
              'Created a static file accessible by route: ' +
              clc.yellow(routePath + item)
          );
        }
        break;
    }
  });
}

export default createStaticRoutes;
