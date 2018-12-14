'use strict'

let gulp = require('gulp'),
  rename = require('gulp-rename');
	//del = require('del');


//通用模块
gulp.task("move",function(){
  //favicon.ico
  gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('./built'))

  //公用html
  gulp.src([
    './src/**/*.html'
    ])
    .pipe(gulp.dest('./built'))

    gulp.src('./src/frontend_static/**/*.*')
    .pipe(gulp.dest('./built/frontend_static'))

    gulp.src('./src/images/**/*.*')
    .pipe(gulp.dest('./built/images/'))
    gulp.src('./src/public/excel/*.*')
    .pipe(gulp.dest('./built/public/excel/'))

    gulp.src('./src/mdimg/*.*')
    .pipe(gulp.dest('./built/'))
    gulp.src('./src/mdimg/images/*.*')
    .pipe(gulp.dest('./built/images/'))
    gulp.src('./src/mdimg/**/*.*')
    .pipe(gulp.dest('./built/dashboard/'))
  
})

//default config.js
gulp.task("defConfMove",function(){
  gulp.src('./src/config/config.js')
    .pipe(gulp.dest('./built/config/'))
})




gulp.task('default', ['move','defConfMove'])



