'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('source/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});