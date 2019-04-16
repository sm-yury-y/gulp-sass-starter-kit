'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const imagemin = require('gulp-imagemin');


let paths = {
  src: {
    html: 'source/*.html',
    scss: 'source/styles/main.scss',
    js:   'source/js/main.js',
    img:  'source/images/**/*'
  },
  dest: {
    html: 'build/',
    css:  'build/css',
    js:   'build/js',
    img:  'build/images'
  }
};

/* BrowserSync */
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "build"
    },
    notify: false
  });

  gulp.watch('build/**/*.*').on('change', browserSync.reload);
});

/* Copy all HTML files */
gulp.task('html', function(done) {
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dest.html));
    done();
});

/* Styles compile */
gulp.task('sass', function() {
  return gulp.src(paths.src.scss)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Styles',
          message: err.message
        }
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe(rename({
    //   suffix: '.min',
    //   prefix: ''
    // }))
    // .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.css));
});

/* Scripts compile */
gulp.task('scripts', function() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.js))
});

gulp.task('imagemin', function() {
  return gulp.src(paths.src.img)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
     optimizationLevel: 5,
    }))
    .pipe(gulp.dest(paths.dest.img));
});

gulp.task('del', function() {
  return del('build');
});

gulp.task('watch', function () {
	gulp.watch(paths.src.html, gulp.parallel('html'));
	gulp.watch(paths.src.scss, gulp.series('sass'));
	gulp.watch(paths.src.js, gulp.series('scripts'));
});

gulp.task('default', gulp.series(
    gulp.series('html'),
    gulp.parallel('sass', 'scripts'),
    gulp.parallel('watch', 'browser-sync')
));