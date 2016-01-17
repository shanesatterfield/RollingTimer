var gulp = require('gulp');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('compress', function() {
    gulp.src(['static/js/helper.js', 'static/js/timer.js', 'static/js/anim.js'])
        .pipe(concat('production.min.js'))
        .pipe(gulp.dest('static/'));
});

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
