const clc = require('cli-color');
const fs = require('fs');
const path = require('path');
const { formattingRoute, setupTemplate } = require('../routeFormatter');

const createStaticRoutes = (app, dirname) => {
  const viewsFolder = path.join(dirname, 'views');
  console.log(
    clc.cyanBright('[HELIUM] ') + clc.bgBlackBright('Creating static routers')
  );
  parseFolders(app, viewsFolder);
};

function parseFolders(app, dir, routePath = '/') {
  const readingDir = fs.readdirSync(path.join(dir, routePath));

  readingDir.forEach((item) => {
    switch (item) {
      case 'index.html':
        app.get(routePath, (req, res) => {
          res.set('Content-Type', 'text/html')
          res.send(formattingRoute(dir, routePath))
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
          parseFolders(app, dir, `${routePath}${item}/`);
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

module.exports = {
  createStaticRoutes: createStaticRoutes,
};
