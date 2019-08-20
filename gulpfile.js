const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const htmlmin = require('gulp-htmlmin');

function copyHtmlTask(cb) {
    src("src/**/*.html").pipe(htmlmin({ collapseWhitespace: true })).pipe(dest("dist"));
    cb();
}//copyHtmlTask

function copyAsstsTask(cb) {
    src("src/favicon.ico").pipe(dest("dist"));
    src("src/assets/**/*").pipe(dest("dist/assets"));
    cb();
}//copyAsstsTask

function compileTsTask(cb) {
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
}//compileTsTask

function compileSassTask(cb) {
    src("src/**/*.scss").pipe(sass()).pipe(dest("dist"));
    cb();
}//compileSassTask

function watchAndReCompileTask(cb) {
    watch('src/**/*.ts', { ignoreInitial: true }, compileTsTask);
    watch('src/**/*.scss', { ignoreInitial: true }, compileSassTask);
    watch('src/**/*.html', { ignoreInitial: true }, copyHtmlTask);
    cb();
}//watchAndReCompileTask

exports.watch = watchAndReCompileTask;
exports.default = parallel(copyHtmlTask, copyAsstsTask, compileTsTask, compileSassTask);
