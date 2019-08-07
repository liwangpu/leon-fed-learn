const { src, dest, parallel } = require("gulp");
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

module.exports.default = parallel(copyAsstsTask, compileTsTask, compileSassTask);
