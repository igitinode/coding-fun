'use strict';

requirejs.config({
  //引入外部js
  paths: {
    jquery: 'jquery-1.11.3.min'
  }
});

requirejs(['jquery', 'validate'], function ($, validate) {
  $('body').css('background-color', 'red');
  console.log(validate.isEqual(1, 2));
});