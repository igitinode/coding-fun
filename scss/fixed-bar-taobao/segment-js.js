/**
 * 
 * @authors Jack Chen (igitinode@gmail.com)
 * @date    2015-11-24 10:11:15
 * @version 0.1.0
 */

/**
 *
 * 淘宝固定边栏滚动特效片段
 * 2、js实现方法
 */

var $ = function(id){
  return document.getElementById(id);
}

var addEvent = function ( obj, event, fn ) {
  if ( obj.addEventListener ) {
    obj.addEventListener(event,fn,false);
  } else if ( obj.attachEvent ) {
    obj.attachEvent('on'+event,fn);
  }
}

var scrollEvent = function(){
  var domSider = $('J_BdSide');
  var sideHeight = domSider.offsetHeight;
  var screenHeight =document.documentElement.clientHeight||document.body.clientHeight;
  var scrollHeight = document.documentElement.scrollTop||document.body.scrollTop;
  if ( scrollHeight + screenHeight > sideHeight ) {
    domSider.style.cssText = 'position:fixed;right:0px;top:'+(-(sideHeight-screenHeight))+'px';
  } else {
    domSider.style.position='static';
  }
}
addEvent(window,'scroll',function(){
  scrollEvent(); 
});

addEvent(window,'resize',function(){
  scrollEvent();
});