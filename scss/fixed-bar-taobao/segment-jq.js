/**
 * 
 * @authors Jack Chen (igitinode@gmail.com)
 * @date    2015-11-24 09:38:37
 * @version 0.1.0
 */

/**
 *
 * 淘宝固定边栏滚动特效片段
 * 1、jQuery实现方法
 */

/*<script>
  $(window).scroll(function() {
    var windowHeight = $(window).scrollTop() + $(window).height();
    var sideHeight = $('#J_BdSide').height();
    if (windowHeight > sideHeight) {
      $('#J_BdSide').css({
        'position' : 'fixed',
        right : '0px',
        top : -(sideHeight - $(window).height())
      });
    } else {
      $('#J_BdSide').css({
        'position' : 'static'
      });
    }
  });
</script>*/

var jWindow = $(window);

// 定义scroll执行逻辑
jWindow.scroll( function() {
  var scrollHeight = jWindow.scrollTop();
  var screenHeight = jWindow.height();
  var sideHeight   = $('#J_BdSide').height();

  if ( scrollHeight + screenHeight > sideHeight ) {
    $('#J_BdSide').css({
      'position': 'fixed',
      'top'     : -(sideHeight - screenHeight),
      'right'   : 0
    });
  } else {
    $('#J_BdSide').css({
      'position' : 'static',

    });
  }
});
// 第一次加载的时候触发定义scroll
window.onload = function () {
  jWindow.trigger('scroll');
};
// 重新调整窗口大小，触发定义的scroll
jWindow.resize(function () {
  jWindow.trigger('scroll');
});
