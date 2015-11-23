// 1、数据定义（ajax）
var data = [
  {img:1, h2:'Creative',h3:'DUET'},
  {img:2, h2:'Friendly',h3:'DEVIL'},
  {img:3, h2:'Tranquilent',h3:'COMPATRIOT'},
  {img:4, h2:'Insecure',h3:'HUSSLER'},
  {img:5, h2:'Loving',h3:'REBEL'},
  {img:6, h2:'Passionate',h3:'SEEKER'},
  {img:7, h2:'Crazy',h3:'FRIEND'}
];

// 2、通用函数, 获得DOM元素
var g = function (id) {
  if (id.substr(0, 1) === '.') {
    return document.getElementsByClassName(id.substr(1));
  }
  return document.getElementById(id);
};

// 3、添加幻灯片操作（所有幻灯片&对应按钮）
function addSliders () {
  // 3.1 获得模板, 将前后空白符去掉
  var tpl_main = g('template_main').innerHTML
                                   .replace(/^\s*/, '')
                                   .replace(/^\s*$/, '');
  var tpl_ctrl = g('template_ctrl').innerHTML
                                   .replace(/^\s*/, '')
                                   .replace(/^\s*$/, '');

  // 3.2 定义最终输出 HTML 变量
  var out_main = [];
  var out_ctrl = [];

  // 3.3 遍历所有数据，构建最终输出 HTML
  for ( i in data ) {
    var _html_main = tpl_main
                    .replace(/{{index}}/g, data[i].img)
                    .replace(/{{h2}}/g, data[i].h2)
                    .replace(/{{h3}}/g, data[i].h3)
                    .replace(/{{css}}/g, ['', 'main-item-right'][i%2]);
    var _html_ctrl = tpl_ctrl.replace(/{{index}}/g, data[i].img);

    out_main.push(_html_main);
    out_ctrl.push(_html_ctrl);
  };

  // 3.4 把HTML 回写到对应的DOM里面
  g('template_main').innerHTML = out_main.join('');
  g('template_ctrl').innerHTML = out_ctrl.join('');
};

// 5、幻灯片切换
function switchSlider (index) {
  // 5.1 获得要展现的幻灯片&控制按钮 DOM
  var main = g('main_' + index);
  var ctrl = g('ctrl_' + index);

  // 5.2 获得所有幻灯片&控制按钮，清除active样式
  var clear_main = g('.main-item');
  var clear_ctrl = g('.ctrl-item');
  // 此处有坑，必须循环clear_ctrl 因为添加了第7步
  for (var i = 0, len = clear_ctrl.length; i < len; i++) {
    clear_main[i].className = clear_main[i].className.replace(' main-item-active', '');
    clear_ctrl[i].className = clear_ctrl[i].className.replace(' ctrl-item-active', '');
  };
  // 5.3 附加当前样式 注意空格
  main.className += ' main-item-active';
  ctrl.className += ' ctrl-item-active';
};

// 6、动态调整图片的 margin-top 以使其垂直居中
function movePictrues () {
  var pictures = g('.picture');
  for (var i = 0, len = pictures.length; i < len; i++) {
    pictures[i].style.marginTop = (-1 * pictures[i].clientHeight/2) + 'px';
  };
};
// 4、定义何时处理幻灯片输出
window.onload = function () {
  addSliders();
  switchSlider(1);
  setTimeout(function(){
    movePictrues();
  }, 100);
};
