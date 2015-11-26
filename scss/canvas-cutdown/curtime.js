/**
 * 
 * @authors Jack Chen (igitinode@gmail.com)
 * @date    2015-11-26 14:53:17
 * @version 0.1.0
 */

var WINDOW_WIDTH  = 1024;    // 屏幕的宽
var WINDOW_HEIGHT = 600;     // 屏幕的高
var RADIUS        = 8;       // 定义每个小球的半径
var MARGIN_TOP    = 10;      // 第一个数字距离画布顶部的距离
var MARGIN_LEFT   = 30;      // 第一个数字距离画布左边的距离
var curShowTimeSeconds = 0;  // 现在倒计时需要有多少秒

var balls = [];       // 设置小球滚动小球集合
// 小球的随机颜色值集合10个
const colors = ['#33B5E5','#0099CC','#AA66CC','#9933CC','#99CC00','#669900','#FFBB33','#FF8800','#FF4444','#CC0000'];


window.onload = function () {

  WINDOW_WIDTH = document.documentElement.clientWidth-20;
  WINDOW_HEIGHT = document.documentElement.clientHeight-20;

  MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;

  // MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);

  var canvas  = document.getElementById('canvas');    // 获取canvas画布对象
  var context = canvas.getContext('2d');              // 获得canvas绘图的上下文内容
  // 手动设置，便于自适应
  canvas.width  = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  // 3、计算当前倒计时有多少秒
  curShowTimeSeconds = getCurrentShowTimeSeconds();

  // 5、设置每一帧动画
  // render( context );
  setInterval( function(){
    render( context ); // 负责绘制
    update();          // 负责数据改变
  }, 30);
};

// 1、编写绘制逻辑
function render ( cxt ) {

  // 6、刷洗矩形空间图像
  cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
  // 4、分别计算时分秒
  // var hours = 12;
  // var minutes = 34;
  // var second = 56;
  var hours = parseInt( curShowTimeSeconds / 3600 );
  var minutes = parseInt( (curShowTimeSeconds - hours*3600) / 60 );
  var seconds = parseInt( curShowTimeSeconds % 60 );

  // 绘制小时十位和个位，每个数字是7*2+1个半径
  renderDigit ( MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt );
  renderDigit ( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt );
  // 绘制冒号 冒号是4*2个半径+1的空白距离
  renderDigit ( MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, cxt );
  // 绘制分钟
  renderDigit ( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt );
  renderDigit ( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt );
  renderDigit ( MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10, cxt );
  // 绘制秒钟
  renderDigit ( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt );
  renderDigit ( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt );

  // 9、绘制彩色小球
  for( var i = 0 ; i < balls.length ; i ++ ) {
    cxt.fillStyle=balls[i].color;

    cxt.beginPath();
    cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
    cxt.closePath();

    cxt.fill();
  }
}

// 2、绘制每一个数字，参数包括坐标、数字、上下文环境
function renderDigit ( x, y, num, cxt ) {
  // 设置绘制数字的颜色
  cxt.fillStyle = 'rgb(0,102,153)';

  // 循环绘制每个数字的二维点阵
  for (var i = 0; i < digit[num].length; i++) {
    for (var j = 0; j < digit[num][i].length; j++) {
      if ( digit[num][i][j] === 1) {
        cxt.beginPath();
        // 绘制小圆 根据点阵图园(RADIUS) 7 * 10 有个虚拟的正方形包围圆2*(RADIUS+1)
        cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
        cxt.closePath();
        cxt.fill();
      };
    };
  };
}

// 3、获取倒计时的总秒数
function getCurrentShowTimeSeconds () {
  // 获取当前时间
  var curTime = new Date();
  var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
  return ret;
}

// 5、调整时间的变化
function update() {
  // 看一下下一次要显示的时间是多少
  var nextShowTimeSeconds = getCurrentShowTimeSeconds();
  // 看一下下一次要显示的时间和当前时间有没有变化，有变化，就改变curShowTimeSeconds
  // 对下一秒时间计算，以便会出小球动画
  var nextHours = parseInt( nextShowTimeSeconds / 3600 );
  var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours*3600) / 60 );
  var nextSeconds = parseInt( nextShowTimeSeconds % 60 );

  // 获当前的时间
  var curHours = parseInt( curShowTimeSeconds / 3600 );
  var curMinutes = parseInt( (curShowTimeSeconds - curHours*3600) / 60 );
  var curSeconds = parseInt( curShowTimeSeconds % 60 );

  // 只需要比较秒数就够了
  if ( nextSeconds !== curSeconds ) {
    // 7、对6个数字经行变化判断，将变化数字的球放入balls里面
    if ( parseInt(curHours/10) !== parseInt(nextHours/10) ) {
      // 8、负责加每个数字的小球
      addBalls( MARGIN_LEFT+0, MARGIN_TOP, parseInt(nextHours/10));
    }

    if ( parseInt(curHours%10) !== parseInt(nextHours%10) ) {
      addBalls( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(nextHours%10));
    }

    if( parseInt(curMinutes/10) !== parseInt(nextMinutes/10) ){
      addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(nextMinutes/10) );
    }

    if( parseInt(curMinutes%10) !== parseInt(nextMinutes%10) ){
      addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(nextMinutes%10) );
    }

    if( parseInt(curSeconds/10) !== parseInt(nextSeconds/10) ){
      addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds/10) );
    }

    if( parseInt(curSeconds%10) !== parseInt(nextSeconds%10) ){
      addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
    }

    curShowTimeSeconds = nextShowTimeSeconds;
  }

  // 更新已存在balls的小球状态
  updateBalls();

  console.log( balls.length)
}

function addBalls ( x, y, num) {
  // 循环绘制彩色数字的二维点阵
  for (var i = 0; i < digit[num].length; i++) {
    for (var j = 0; j < digit[num][i].length; j++) {
      if ( digit[num][i][j] === 1) {

        var aBall = {
          x: x + j * 2 * ( RADIUS + 1 ) + ( RADIUS + 1 ),
          y: y + i * 2 * ( RADIUS + 1 ) + ( RADIUS + 1 ),
          g: 1.5 + Math.random(), // 重力加速度
          vx: Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4, // x轴速度-4或者+4
          vy: -5,  //y轴速度
          color: colors[ Math.floor( Math.random()*colors.length )] // 随机颜色
        };

        balls.push( aBall );

      };
    };
  };
}

function updateBalls() {
  for( var i = 0 ; i < balls.length ; i ++ ){

    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
      balls[i].y = WINDOW_HEIGHT-RADIUS;
      balls[i].vy = - balls[i].vy*0.75;
    }
  }

  // 将超出边界的小球去除
  var cnt = 0;
  for (var i = 0; i < balls.length; i++ ) {
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH ) {
      balls[cnt++] = balls[i];
    }
  }

  // 删除后cnt的小球
  while ( balls.length > Math.min(300, cnt) ) {
    balls.pop();
  }
}
