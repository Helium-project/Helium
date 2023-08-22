import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const buildAll = (app, dir, options, routePath = '/') => {
    const readingDir = fs.readdirSync(path.join(dir, routePath));
    const buildDir = path.join(__dirname, '../../../.build');

    readingDir.forEach((item) => {
        switch (item) {
            case 'index.js':
                esbuild.buildSync({
                    entryPoints: [path.join(dir, routePath, item)],
                    bundle: true,
                    outfile: path.join(buildDir, routePath, item),
                    allowOverwrite: true,
                    loader: { '.js': 'jsx' },
                });
                break;
            default:
                if (
                    fs.lstatSync(path.join(dir, routePath, item)).isDirectory()
                ) {
                    if (!fs.existsSync(path.join(buildDir, routePath, item))) {
                        fs.mkdirSync(path.join(buildDir, routePath, item));
                    }
                    buildAll(app, dir, options, `${routePath}${item}/`);
                } else {
                    fs.copyFileSync(
                        path.join(dir, routePath, item),
                        path.join(buildDir, routePath, item)
                    );
                }
                break;
        }
    });
};
