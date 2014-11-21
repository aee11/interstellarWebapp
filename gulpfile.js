var gulp = require('gulp');
var concat = require('gulp-concat');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});
var app = require('./app')

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

gulp.task('watch', function() {
  plugins.nodemon({
    script: './bin/www',
    ext: 'html js'
  }).on('restart', function() {
    console.log('restarted!');
  });
});

gulp.task('ngTemplate', function() {
  gulp.src('./partials/*.jade')
    .pipe(plugins.jade({
      locals: {}
    }))
    .pipe(gulp.dest('./public/template/'))
});

// gulp.task('scripts', function() {
//   return gulp.src('bower_components/bootstrap-material-design/dist/js/*.min.js')
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('public/javascripts'));
// });

gulp.task('bower', ['bowerjs', 'bowercss'])
gulp.task('angular', ['ngTemplate'])
gulp.task('default', ['bower', 'angular'])