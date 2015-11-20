'use strict';

function openNew() {
  // 获取整个页面的宽度和高度
  var sHeight = document.documentElement.scrollHeight;
  var sWidth = document.documentElement.scrollWidth;

  // 可视区域宽度和高度
  var wHeight = document.documentElement.clientHeight;
  var wWidth = document.documentElement.clientWidth;

  // 创建遮罩层div并插入到body中
  var oMask = document.createElement('div');
      oMask.id = 'mask';
      oMask.style.height = sHeight + 'px';
      oMask.style.width = sWidth + 'px';
  document.body.appendChild(oMask);

  // 实现登陆遮罩弹出
  var oLogin = document.createElement('div');
      oLogin.id = 'login';
      oLogin.innerHTML = '<div id=\'loginCon\'><div id=\'close\'></div></div>';
      document.body.appendChild(oLogin);
  // 获取页面内部Login元素的宽度和高度,必须存在于HTML里面
  var dHeight = oLogin.offsetHeight;
  var dWidth = oLogin.offsetWidth;

  // 垂直居中显示登陆框
  oLogin.style.left = (sWidth - dWidth) / 2 + 'px';
  oLogin.style.top  = (wHeight - dHeight) / 2 + 'px';

  // 获取close
  var oClose = document.getElementById('close');
  oMask.onclick = oClose.onclick = function() {
    document.body.removeChild(oMask);
    document.body.removeChild(oLogin);
  };
};

window.onload = function() {
  var oBtn = document.getElementById('btnLogin');
  oBtn.onclick = function() {
    openNew();
  };
};