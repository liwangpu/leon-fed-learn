const { src, dest, parallel, watch } = require("gulp");
const ts = require("gulp-typescript");
const sass = require("gulp-sass");

let tsProject = ts.createProject('tsconfig.json');

function copyAsstsTask(cb) {
    src("src/**/*.html").pipe(dest("dist"));
    src("src/favicon.ico").pipe(dest("dist"));
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
    cb();
}

exports.watch = watchAndReCompileTask;
exports.default = parallel(copyAsstsTask, compileTsTask, compileSassTask);
