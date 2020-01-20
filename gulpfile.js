const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel')

gulp.task('uglify',function(){
    return gulp.src('./src/index.js')
    .pipe(babel({
        presets: ['es2015']
      }))
    .pipe(uglify({
        compress: true,
      }))
    .pipe(gulp.dest('.'));
});