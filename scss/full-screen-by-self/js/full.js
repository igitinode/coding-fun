/**
 * 
 * @authors Jack Chen (igitinode@gmail.com)
 * @date    2015-11-27 16:33:28
 * @version 0.1.0
 */

// jQuery闭包优点
// 避免全局依赖
// 避免第三方破坏
// 兼容jQuery操作符'$'和jQuery
/**
 * jQuery 开发方式
 * 
 * 1、类级别组件开发
 * 即给jQuery命名空间下添加新的全局函数，也称为静态方法
 * jQuery.myPlugin = function() {}
 * 例如：$.Ajax(), $.extend(),...
 * 
 * 2、对象级别组件开发
 * 即挂在jQuery原型下的方法，这样通过选择器获取jQuery对象实例也能共享该方法，也称为动态方法
 * $.fn.myPlugin = fucntion() {}
 * $.fn === $.prototype
 * 例如：addClass(), attr(),... 需要创建实例来调用
 */

// 代码说明: 链式调用 --> return this 返回当前对象来维护插件的链式调用
(function ( $ ) {

  /**
   * 说明：获取浏览器前缀
   * 实现：判断某个元素的css样式中是否存在transition属性
   * 参数：dom元素
   * 返回值：boolean，有则返回浏览器样式前缀，否则返回false
   */
   var _prefix = (function( temp ) {
    var aPrefix = ['webkit','Moz','o','ms'],
        props ='';
    for ( var i in aPrefix ) {
      props = aPrefix[i] + 'Transition';
 
      if ( temp.style[props] !== undefined ) {
        return '-' + aPrefix[i].toLowerCase() + '-';
      }
    }
    return false;
   })(document.createElement(PageSwitch));

  var PageSwitch = (function() {
    function PageSwitch( element, options ) {
      this.settings = $.extend( true, $.fn.PageSwitch.defaults, options || {} );
      this.element = element;
      this.init();  // 初始化插件
    };

    PageSwitch.prototype = {
      /* 实现：初始化DOM结构，布局，分页及绑定事件 */
      init: function() {
        var me = this;
        console.log(this);
        me.selectors  = me.settings.selectors;
        me.sections   = me.element.find(me.selectors.sections);
        me.section    = me.element.find(me.selectors.section);

        me.direction  = me.selectors.direction === 'vertical' ? true : false;
        me.pagesCount = me.pagesCount();
        me.canScroll = true;
        me.index      = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

        if ( !me.direction ) {
          me._initLayout();
        }

        if ( me.settings.paganation ) {
          me._initPaging();
        }

        me._initEvent();
      },
      /* 实现：获取滑动页面数量 */
      pagesCount: function() {
        return this.section.length;
      },
      /* 实现：获取滑动的宽度（横屏滑动）或高度（竖屏滑动) */
      switchLength: function() {
        return this.direction ? this.element.height() : this.element.width();
      },
      /* 向前滑动即上一页 */
      prev: function() {
        var me = this;
        if ( me.index > 0 ) {
          me.index --;
        } else if ( me.settings.loop ) {
          me.index = me.pagesCount - 1;       
        }
        me._scrollPage();
      },
      /* 向后滑动即下一页 */
      next: function(){
        var me=this;
        if ( me.index < me.pagesCount ) {
          me.index ++;
        } else if ( me.settings.loop ) {
          me.index = 0;
        }
        me._scrollPage();
      },
      /* 实现：主要针对横屏情况进行页面布局 */

      // 以下为私有
      _initLayout: function() {
        var me = this;
        var width = (me.pagesCount * 100) + '%',
        cellWidth = (100/me.pagesCount).toFixed(2) + '%';
        me.sections.width(width);
        me.section.width(cellWidth).css('float', 'left');
      },
      /* 实现：实现分页的dom结构及css样式 */
      _initPaging: function() {
        var me = this,
            pagesClass = me.selectors.page.substring(1);
            me.activeClass = me.selectors.active.substring(1);
        var pageHtml = '<ul class=' + pagesClass + '>';

        for (var i = 0; i < me.pagesCount; i++) {
          pageHtml += '<li></li>';
        };
        pageHtml += '</ul>';
        me.element.append(pageHtml);
        var pages = me.element.find(me.selectors.page);
        me.pageItem = pages.find('li');
        me.pageItem.eq(me.index).addClass(me.activeClass);

        // direction
        if ( me.direction )  {
          pages.addClass('vertical');
        } else {
          pages.addClass('horizontal');
        }
      },
      /* 实现: 初始化插件事件 */
      _initEvent: function() {
        var me = this;
        me.element.on('click', me.selectors.pages + ' li', function() {
          me.index = $(this).index();
          me._scrollPage();
        });

        me.element.on('mousewheel DOMMouseScroll', function( e ) {
          var delta = e.originalEvent.wheeelDelta || -e.originalEvent.detail;

          if ( delta > 0 &&  (me.index && !me.settings.loop || me.settingsloop)) {
            me.prev();
          } else if ( delta < 0 && (ne.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
            me.next();
          }
        });

        if ( me.settings.keyboard ) {
          $(window).on('keydown', function( e ) {
            var keyCode = e.keyCode;
            if ( keyCode === 37 || keyCode === 38 ) {
              me.prev();
            } else if ( keyCode === 39 || keyCode === 40 ) {
              me.next();
            }
          })
        }

        $(window).resize(function() {
          var currentLength = me.switchLength(),
              offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
          if ( Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1) ) {
            me.index++;
          }
          if ( me.index ) {
            me._scrollPage();
          }
        });

        me.sections.on('webkitTransitionEnd msTransitionend mozTransitionend transitionend', function() {
          me.canScroll = true;
          
          if ( me.settings.callback && $.type( me.settings.callback ) === 'function' ) {
              me.settings.callback();
          }
        });
      },
      _scrollPage: function() {
        var me = this,
        dest = me.section.eq(me.index).position();
        if ( !dest ) return;
        me.canScroll = false;
        if ( _prefix ) {
          me.sections.css(_prefix + 'transition','all ' + me.settings.duration + 'ms '+ me.settings.easing);
          var translate = me.direction ? 'translateY(-' + dest.top + 'px)' : 'translateX(-' + dest.left + 'px)';
          me.sections.css(_prefix + 'transform',translate);
        } else {
          var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
          me.sections.animate(animateCss, me.settings.duration, function() {
            me.canScroll = true;
            if ( me.settings.callback && $.type(me.settings.callback) === 'function') {
              me.settings.callback();
            }
          })
        }
        if ( me.settings.pagination ) {
          me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
        }
      }
    };
    return PageSwitch;
  })();


  $.fn.PageSwitch = function( options ) {
    // Singleton Pattern
    console.log('star');
    return this.each( function() {
      var me = $( this ),
          instance = me.data( 'PageSwitch' );
      if ( !instance ) {
        instance = new PageSwitch( me, options );
        me.data( 'PageSwitch', instance );
      }
      if ( $.type( options ) === 'string' ) {
        return instance[options]();
      }
    });
  };

  $.fn.PageSwitch.defaults = {
    selectors: {       // 定义默认class名字
      sections: '.sections',
      section: '.section',
      page: '.pages',
      active: '.active'
    },
    index: 0,                 // 默认显示页面
    easing: 'ease',           // 动画效果
    duration: '500',          // 切换时间
    loop: false,              // 循环
    paganation: true,         // 分页处理
    keyboard: true,           // 触发键盘事件
    direction: 'vertical',    // 滑动方向vertical、horizontal
    callback: ''              // 当实现滑屏动画之后调用的回调理数
  };

  $(function(){
    $('[data-PageSwitch]').PageSwitch({
      loop: true,
      direction: 'horizontal',
      callback:function(){}
    });
  });
})( jQuery );
