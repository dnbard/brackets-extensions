var gulp = require('gulp'),
    less = require('less'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css');

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
