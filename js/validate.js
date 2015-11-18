'use strict';
// require 格式
// 将一个个功能定义成模块
define(['jquery'], function ($) {
  // 只有返回外面才可以访问
  return {
    isEmpty: function () {

    },
    checkLength: function () {
      
    },
    isEqual: function (str1, str2) {
      return str1 === str2;
    }
  };
});