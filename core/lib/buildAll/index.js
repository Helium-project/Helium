import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import store from '../../store/index.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

/*

    Builds the application when useBuild is enabled

*/

export const buildAll = (app, routePath = '/') => {
    const readingDir = fs.readdirSync(path.join(store.getProjectDir(), routePath));
    const buildDir = path.join(__dirname, '../../../.build');

    readingDir.forEach((item) => {
        switch (item) {
            case 'index.js':
                esbuild.buildSync({
                    entryPoints: [path.join(store.getProjectDir(), routePath, item)],
                    bundle: true,
                    outfile: path.join(buildDir, routePath, item),
                    allowOverwrite: true,
                    loader: { '.js': 'jsx' },
                });
                break;
            default:
                if (
                    fs.lstatSync(path.join(store.getProjectDir(), routePath, item)).isDirectory()
                ) {
                    if (!fs.existsSync(path.join(buildDir, routePath, item))) {
                        fs.mkdirSync(path.join(buildDir, routePath, item));
                    }
                    buildAll(app, `${routePath}${item}/`);
                } else {
                    fs.copyFileSync(
                        path.join(store.getProjectDir(), routePath, item),
                        path.join(buildDir, routePath, item)
                    );
                }
                break;
        }
    });
};
