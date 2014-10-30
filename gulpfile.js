var gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    del = require('del'),
    browserify = require('gulp-browserify');

gulp.task('build-less', function(){
    gulp.src('less/style.less')
        .pipe(less())
        .pipe(gulp.dest('public/'))
        .pipe(rename('style.min.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('public/'));
});

gulp.task('build-js', function(){
    gulp.src('viewmodels/*.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('default', function(){
    function onChange(event) {
        console.log('File ' + event.path + ' was ' + event.type);
    }

    var lessWatcher = gulp.watch('less/**/*.less', ['build-less']);
    var jsWatcher = gulp.watch('viewmodels/*.js', ['build-js']);

    lessWatcher.on('change', onChange);
    jsWatcher.on('change', onChange);
});

gulp.task('build', ['build-less', 'build-js'], function(){
    del([
        'build/public/**',
        'build/src/**',
        'build/views/**'
  ], function(){
        gulp.src('public/**/*')
        .pipe(gulp.dest('build/public'));

        gulp.src('src/**/*')
            .pipe(gulp.dest('build/src'));

        gulp.src('views/**/*')
            .pipe(gulp.dest('build/views'));

        gulp.src('app.js')
            .pipe(gulp.dest('build/'));

        gulp.src('newrelic.js')
            .pipe(gulp.dest('build/'));

        gulp.src('Procfile')
            .pipe(gulp.dest('build/'));

        gulp.src('package.json')
            .pipe(gulp.dest('build/'));
    });
});
