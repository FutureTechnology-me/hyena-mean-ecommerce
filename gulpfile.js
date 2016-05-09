var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


// Scripts
gulp.task('scripts', function() {
  return gulp.src('public/app/lib/controllers/*.js')
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('temp/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/app/'))
});