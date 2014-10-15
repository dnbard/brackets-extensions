var gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    del = require('del');

gulp.task('build-less', function(){
    gulp.src('less/style.less')
        .pipe(less())
        .pipe(gulp.dest('public/'))
        .pipe(rename('style.min.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('public/'));
});

gulp.task('default', function(){
    function onChange(event) {
        console.log('File ' + event.path + ' was ' + event.type);
    }

    var lessWatcher = gulp.watch('less/**/*.less', ['build-less']);

    lessWatcher.on('change', onChange);
});

gulp.task('build', ['build-less'], function(){
    del([
    'build/**',
    '!build/.git'
  ], function(){
        gulp.src('public/**/*')
        .pipe(gulp.dest('build/public'));

        gulp.src('src/**/*')
            .pipe(gulp.dest('build/src'));

        gulp.src('views/**/*')
            .pipe(gulp.dest('build/views'));

        gulp.src('app.js')
            .pipe(gulp.dest('build/'));

        gulp.src('Procfile')
            .pipe(gulp.dest('build/'));

        gulp.src('package.json')
            .pipe(gulp.dest('build/'));
    });
});
