var gulp = require('gulp');
var concat = require('gulp-concat');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});

gulp.task('bowerjs', function() {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('*.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('bowercss', function() {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('*.css'))
    .pipe(gulp.dest('public/stylesheets'));
});

// gulp.task('scripts', function() {
//   return gulp.src('bower_components/bootstrap-material-design/dist/js/*.min.js')
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('public/javascripts'));
// });

gulp.task('bower', ['bowerjs', 'bowercss'])
gulp.task('default', ['bower'])