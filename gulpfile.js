const gulp = require('gulp');
const concat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browsersync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const del = require('del');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watcher = require('gulp-watch');

const cssFiles = [
    './src/css/main.css',
    './src/css/plugin.css'
];

const jsFiles = [
    './src/js/main.js',
    './src/js/plugin.js'
];

function styles() {
    return gulp.src(cssFiles)
    .pipe(concat('style.css'))
    .pipe(autoPrefixer({
        browsers: ['last 2 version'],
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))

    .pipe(gulp.dest('./build/css/'))
    .pipe(browsersync.stream())
}

function scssCompile() {
    return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(concat('style.css'))
    .pipe(autoPrefixer({
        browsers: ['last 2 version'],
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browsersync.stream())
}

function scripts() {
    return gulp.src(jsFiles)
    .pipe(concat('main.js'))
    .pipe(uglify())

    .pipe(gulp.dest('./build/js/'))
    .pipe(browsersync.stream())
}

function clean() {
    return del(['./build/*'])
}

function watch() {
    browsersync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch('./src/scss/**/*.scss', gulp.series('scss-compile'))
    gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./**/*.html').on('change', browsersync.reload)
}

gulp.task('scss-compile', scssCompile);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);

gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(scssCompile, scripts)));

gulp.task('dev', gulp.series('build', 'watch'));