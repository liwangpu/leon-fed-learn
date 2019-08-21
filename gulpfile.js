const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const browserify = require("browserify");
const tsify = require("tsify");
const source = require("vinyl-source-stream");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const server = require('browser-sync').create();

function cleanDist(cb) {
    del.sync(["dist/**"]);
    cb();
}//cleanDist

function startServer(cb) {
    server.init({
        server: {
            baseDir: "./dist"
        }
    });
    cb();
}//startServer

function reloadServer(cb) {
    server.reload();
    cb();
}//reloadServer

function copyHtml(cb) {
    src("src/**/*.html").pipe(htmlmin({ collapseWhitespace: true })).pipe(dest("dist"));
    cb();
}//copyHtml

function copyAssts(cb) {
    src("src/favicon.ico").pipe(dest("dist"));
    src("src/assets/**/*").pipe(dest("dist/assets"));
    cb();
}//copyAssts

function compileTs(cb) {
    browserify({
        basedir: '.',
        debug: true,
        entries: ['src/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(dest("dist"));
    cb();
}//compileTs

function compileSass(cb) {
    src("src/**/*.scss").pipe(sass()).pipe(dest("dist"));
    cb();
}//compileSass

function watchAndReCompile(cb) {
    watch('src/**/*.ts', { ignoreInitial: true }, series(compileTs, reloadServer));
    watch('src/**/*.scss', { ignoreInitial: true }, series(compileSass, reloadServer));
    watch('src/**/*.html', { ignoreInitial: true }, series(copyHtml, reloadServer));
    cb();
}//watchAndReCompile

exports.default = series(cleanDist, parallel(copyHtml, copyAssts, compileTs, compileSass), startServer, watchAndReCompile);

