const gulp = require("gulp");
const del = require("del");
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = {
    srcPath: './src/',
    distPath: './dist/'
};

const clean = () => {
    return del([config.distPath]);
};

const copyJsFiles = () => {
    return gulp.src(config.srcPath + 'js/*.js').pipe(gulp.dest(config.distPath + 'js'));
};

const copyImgFiles = () => {
    return gulp.src(config.srcPath + 'imgs/*.*').pipe(gulp.dest(config.distPath + 'imgs'));
};

const copyHmlFiles = () => {
    return gulp.src(config.srcPath + '/*.html').pipe(gulp.dest(config.distPath));
};

const compileSass = () => {
    return gulp.src(config.srcPath + 'styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
};

var copyAllFiles = gulp.series(copyHmlFiles, copyJsFiles, copyImgFiles);
var tasksInit = gulp.series(clean, copyAllFiles, compileSass);

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        port: 8080,
        startPath: 'index.html',
    });

    gulp.watch("src/**/*.*", gulp.series(tasksInit)).on("change", reload);
});

exports.default = gulp.series(tasksInit, 'serve');
