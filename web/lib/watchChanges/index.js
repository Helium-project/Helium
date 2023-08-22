import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import clc from 'cli-color';
import createStaticRoutes from './../createStaticRoutes/index.js';
import store from '../../store/index.js';
import { formattingRoute } from '../routeFormatter/index.js';

/*

    Observer of changes in the project directory, changes the display on the server in case of changes

*/

const watchChanges = (app) => {
    fs.watch(path.join(store.getProjectDir()), { recursive: true }, (event, filename) => {
        switch (event) {
            case 'change':
                switch (getFileNameFromPath(filename)) {
                    case 'index.js':
                        fileChangedIndexJs(
                            event,
                            filename,
                        );
                        break;
                    default:
                        if (
                            fs.lstatSync(path.join(store.getProjectDir(), filename)).isFile()
                        ) {
                            fileChanged(
                                app,
                                event,
                                filename,
                            );
                        }

                        break;
                }
                break;
            case 'rename':
                fileChanged(app, event, filename);
            default:
                break;
        }
    });
};

const fileChangedIndexJs = (event, filename) => {
    store.getOptions().changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `A change in the file has been detected: ` +
                  clc.yellow(filename)
          )
        : undefined;

    const filePath = path.join(store.getProjectDir(), filename);
    const filePathBuild = path.join(store.getBuildDir(), filename);

    if (fs.existsSync(filePathBuild)) {
        fs.rmSync(filePathBuild);
    }

    esbuild.buildSync({
        entryPoints: [filePath],
        bundle: true,
        outfile: filePathBuild,
        allowOverwrite: true,
        loader: { '.js': 'jsx' },
    });

    store.getOptions().changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `file ${clc.yellow(
                      getFileNameFromPath(filename)
                  )} successfully rebuild`
          )
        : undefined;
};

const fileChanged = (app, event, filename) => {
    store.getOptions().changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `A change in the file has been detected: ` +
                  clc.yellow(filename)
          )
        : undefined;

    const filePath = path.join(store.getProjectDir(), filename);
    const filePathBuild = path.join(store.getBuildDir(), filename);

    if (fs.existsSync(filePathBuild)) {
        fs.rmSync(filePathBuild);
    }

    if (fs.existsSync(filePath)) {
        fs.copyFileSync(
            path.join(store.getProjectDir(), filename),
            path.join(store.getBuildDir(), filename)
        );
    }

    app.get(filename.replace(getFileNameFromPath(filename), ''), (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(formattingRoute(dir, routePath));
    });

    store.getOptions().changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `file ${clc.yellow(
                      getFileNameFromPath(filename)
                  )} successfully rebuild`
          )
        : undefined;
};

const getFileNameFromPath = (filePath) => {
    const parts = filePath.split(/[\\/]/);
    const fileName = parts[parts.length - 1];
    return fileName;
};

export default watchChanges;
