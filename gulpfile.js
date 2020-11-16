const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-dart-sass");
const browserify = require("browserify");
const tsify = require("tsify");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
let uglify = require('gulp-uglify-es').default;
var buffer = require('vinyl-buffer');
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const server = require('browser-sync').create();

function cleanDist(cb) {
    del.sync(["images/dist/**"]);
    cb();
}//cleanDist

function startServer(cb) {
    server.init({
        server: {
            baseDir: "./image/dist"
        }
    });
    cb();
}//startServer

function reloadServer(cb) {
    server.reload();
    cb();
}//reloadServer

function copyHtml(cb) {
    src("src/**/*.html").pipe(htmlmin({ collapseWhitespace: true })).pipe(dest("image/dist")).on('end', cb);
}//copyHtml

function copyAssts(cb) {
    src("src/favicon.ico").pipe(dest("image/dist"));
    src("src/assets/**/*").pipe(dest("image/dist/assets"));
    cb();
}//copyAssts

function compileTs(cb) {
    browserify({
        basedir: '.',
        debug: false,
        entries: ['src/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform("babelify", {
            presets: ["es2015"],
            extensions: [".ts"],
        })
        .on('error', cb)
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(dest("image/dist"))
        .on('end', cb);
}//compileTs

function compileSass(cb) {
    src("src/**/*.scss").pipe(sass())
        .on('error', cb)
        .pipe(dest("image/dist")).on('end', cb);
}//compileSass

function watchAndReCompile(cb) {
    watch('src/**/*.ts', { ignoreInitial: true }, series(compileTs, reloadServer));
    watch('src/**/*.scss', { ignoreInitial: true }, series(compileSass, reloadServer));
    watch('src/**/*.html', { ignoreInitial: true }, series(copyHtml, reloadServer));
    cb();
}//watchAndReCompile

exports.default = series(cleanDist, parallel(copyHtml, copyAssts, compileTs, compileSass), startServer, watchAndReCompile);

