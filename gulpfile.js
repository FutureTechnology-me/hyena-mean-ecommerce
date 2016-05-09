var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


// Scripts
gulp.task('scripts', function() {
  return gulp.src(['public/app/lib/app.js', 'public/app/lib/routes.js', 'public/app/lib/services.js','public/app/lib/controllers/*.js'])
    .pipe(concat('hyena-ecommerce.js'))
    .pipe(gulp.dest('temp/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/app/'))
});

// Watch
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('public/app/lib/**/*.js', ['scripts']);

});