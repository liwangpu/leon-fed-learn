const { src, dest, parallel, watch } = require("gulp");
const ts = require("gulp-typescript");
const sass = require("gulp-sass");

let tsProject = ts.createProject('tsconfig.json');

function copyHtmlTask(cb) {
    src("src/**/*.html").pipe(dest("dist"));
    cb();
}//copyHtmlTask

function copyAsstsTask(cb) {
    src("src/favicon.ico").pipe(dest("dist"));
    src("src/assets/**/*").pipe(dest("dist/assets"));
    cb();
}//copyAsstsTask

function compileTsTask(cb) {
    src("src/**/*.ts").pipe(tsProject()).js.pipe(dest("dist"));
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
