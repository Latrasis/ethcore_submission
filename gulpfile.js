'use strict';

const gulp = require('gulp')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')

gulp.task('webpack', () => {
    return gulp.src('./src/*.js')
        // Pipe to webpack
        .pipe(webpack({
          output: {filename:'bundle.js'},
          module: {
            loaders: [
              { test: /\.jade$/, loader: 'jade-html' },
              { test: /\.html$/, loader: 'html'}
            ],
          },
        }))
        // Output to public
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('err', sass.logError))
    .pipe(autoprefixer({browsers:['last 2 versions']}))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('serve', () => {
  connect.server({
    root: 'dist'
  })
})

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.js', './src/templates/*.html'], ['webpack'])
  gulp.watch('./src/scss/**/*.scss', ['sass'])
})

gulp.task('default', ['watch','webpack', 'serve'])
