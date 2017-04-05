'use strict';

const gulp = require('gulp');
const tools = require('urbanjs-tools');

tools.initialize(gulp, {
  babel: true,

  // checkDependencies: true,

  // checkFileNames: true,

  //jsdoc: true,

  // nsp: true,

  // mocha: true,

  // retire: true,

  // tslint: true
});

gulp.task('default', ['tslint', 'mocha']);
