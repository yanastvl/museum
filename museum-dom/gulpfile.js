"use strict"

const {
    src,
    dest
} = require("gulp");
const gulp = require("gulp");
const imagemin = require('gulp-imagemin')
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
var sass = require('gulp-sass')(require('sass'));
const cssnano = require("gulp-cssnano");
const tinypng = require('gulp-tinypng');
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();

var path = {
    build: {
        html: ".",
        js: "js/",
        css: "css/",
        images: "assets/img",
        video: "assets/video"
    },
    src: {
        html: "src/*.html",
        js: "src/js/*.js",
        css: "src/css/style.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
        video: "src/assets/video/**/*.{mp3,mp4,ogg,wav,webm}"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        css: "src/css/**/*.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
        video: "src/assets/video/**/*.{mp3,mp4,ogg,wav,webm}"
    },

    clean: "./build"
}


function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: '.'
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
}

function html() {
    return src(path.src.html, {
            base: "src/"
        })
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());

}

function css() {
    return src(path.src.css, {
            base: "src/css/"
        })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());

}

function js() {
    return src(path.src.js, {
            base: './src/js/'
        })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());

}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images));
}

function videos() {
    return gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
        .pipe(browsersync.stream())
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);

}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, videos));
const watch = gulp.parallel(build, watchFiles, browserSync);

/* Exports Tasks */

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.watch = watch;
exports.default = watch;
