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
  gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
    done();
});

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

/* Scripts compile */
gulp.task('scripts', function() {
  return gulp.src([
      'source/js/lib.js',
      'source/js/main.js'
     ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});


gulp.task('del', function() {
  return del('build');
});

gulp.task('watch', function () {
	gulp.watch('source/*.html', gulp.parallel('html'));
	gulp.watch('source/styles/*.scss', gulp.series('sass'));
	gulp.watch('source/js/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series(
    gulp.series('html'),
    gulp.parallel('sass', 'scripts'),
    gulp.parallel('watch', 'browser-sync')
));