'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');


/* Styles compile */
gulp.task('sass', function() {
  return gulp.src('source/styles/main.scss')
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
    .pipe(gulp.dest('build/css'));
});