"use strict";
const { src, dest } = require('gulp');
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const del = require("del");
const eslint = require("gulp-eslint");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const fontmin = require('gulp-fontmin');

// function to synch broser on port 3000 and on host tasmu
function browserSync(done) {
  browsersync.init({
    injectChanges: true,
    open:false,
    host:'',
    port: 3000,
    server: {
      baseDir: "./app/"
    },
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// clean method
function clean() {
  return del(["./dest/"]);
}

// move font
function movefonts() {
  return src('app/fonts/**/*.*') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(gulp.dest("html/fonts/"))
}

// move images
function moveimages() {
  return src('app/images/**/*.*') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(gulp.dest("html/images/"))
}
// move videos
function movevideos() {
  return src('app/videos/**/*.*') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(gulp.dest("html/videos/"))
}
// move arabic
function movearabic() {
  return src('app/ar/**/*.*') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(gulp.dest("html/ar/"))
}

// move javascript and uglify
function movejs() {
  return src('app/js/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.js' }))
    .pipe(dest('html/js'));
}

// move sass and compress
function movecss() {
  return src('app/css/**/*.css') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(sass({outputStyle: 'compressed'}))
          .pipe(rename({ extname: '.css' }))
         .pipe(gulp.dest("html/css/"))
}

// move html
function movehtml() {
  return src('app/*.*') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(gulp.dest("html/"))
}


// frefresh html if changed
function html() {
  return gulp
    .src('app/*.html')
        .pipe(browsersync.stream());
}

// CSS task
function css() {
  return gulp
    .src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
         .pipe(sass())
         .pipe(gulp.dest("app/css/"))
         .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["app/js/**/*.js", "./gulpfile.js"])
    .pipe(plumber())
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["app/js/**/*.js"])
      .pipe(plumber())
      // folder only, filename is specified in webpack config
      //pipe(gulp.dest("dest/js/"))
      .pipe(browsersync.stream())
  );
}

// Watch files
function watchFiles() {
  gulp.watch("app/*.html", html);
  gulp.watch("app/scss/**/*.scss", css);
  gulp.watch("app/js/**/*.js", gulp.series(scriptsLint, scripts));
}

// define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(movecss, movejs,movehtml,moveimages,movefonts,movevideos,movearabic));
const watch = gulp.parallel(watchFiles, browserSync);

exports.css = css;
exports.js = js;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = build;

