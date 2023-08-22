import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import clc from 'cli-color';
import createStaticRoutes from './../createStaticRoutes/index.js';

/*

    Observer of changes in the project directory, changes the display on the server in case of changes

*/

const watchChanges = (app, dirname, buildDir, options) => {
    fs.watch(path.join(dirname), { recursive: true }, (event, filename) => {
        switch (event) {
            case 'change':
                switch (getFileNameFromPath(filename)) {
                    case 'index.js':
                        fileChangedIndexJs(
                            dirname,
                            buildDir,
                            event,
                            filename,
                            options
                        );
                        break;
                    default:
                        if (
                            fs.lstatSync(path.join(dirname, filename)).isFile()
                        ) {
                            fileChanged(
                                app,
                                dirname,
                                buildDir,
                                event,
                                filename,
                                options
                            );
                        }

                        break;
                }
                break;
            case 'rename':
                fileChanged(app, dirname, buildDir, event, filename, options);
            default:
                break;
        }
    });
};

const fileChangedIndexJs = (dirname, buildDir, event, filename, options) => {
    options.changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `A change in the file has been detected: ` +
                  clc.yellow(filename)
          )
        : undefined;

    const filePath = path.join(dirname, filename);
    const filePathBuild = path.join(buildDir, filename);

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

    options.changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `file ${clc.yellow(
                      getFileNameFromPath(filename)
                  )} successfully rebuild`
          )
        : undefined;
};

const fileChanged = (app, dirname, buildDir, event, filename, options) => {
    options.changeFileLog
        ? console.log(
              clc.cyanBright('[HELIUM] ') +
                  `A change in the file has been detected: ` +
                  clc.yellow(filename)
          )
        : undefined;

    const filePath = path.join(dirname, filename);
    const filePathBuild = path.join(buildDir, filename);

    if (fs.existsSync(filePathBuild)) {
        fs.rmSync(filePathBuild);
    }

    if (fs.existsSync(filePath)) {
        fs.copyFileSync(
            path.join(dirname, filename),
            path.join(buildDir, filename)
        );
    }

    app.get(filename.replace(getFileNameFromPath(filename), ''), (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(formattingRoute(dir, routePath, options));
    });

    options.changeFileLog
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
