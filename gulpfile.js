var gulp = require("gulp"),
    del = require("del"),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');
var reload = browserSync.reload;

var config = {
    srcPath: './src/',
    distPath: './dist/'
};

const clean = () => {
    return del([config.distPath]);
};

// concat, copy, uglify and rename
const copyJsFiles = () => {
    return gulp.src(config.srcPath + 'js/*.js')
        .pipe(concat('main-concat.js'))
        .pipe(gulp.dest(config.distPath + '/js'))
        .pipe(rename('main-uglify.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.distPath + 'js'));
};

const copyImgFiles = () => {
    return gulp.src(config.srcPath + 'imgs/*.*').pipe(gulp.dest(config.distPath + 'imgs'));
};

const copyHmlFiles = () => {
    return gulp.src(config.srcPath + '/*.html').pipe(gulp.dest(config.distPath));
};

const copyVendorFiles = () =>{
    return gulp.src(config.srcPath + 'vendor/**/*.*').pipe(gulp.dest(config.distPath + '/vendor/'));
};

const compileSass = () => {
    return gulp.src(config.srcPath + 'styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
};

var copyAllFiles = gulp.series(copyHmlFiles, copyJsFiles, copyImgFiles, copyVendorFiles);
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
