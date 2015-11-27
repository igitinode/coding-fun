(function($){
    var _prefix = (function(temp){
        var aPrefix = ["webkit","Moz","o","ms"],
        props ="";
        for(var i in aPrefix){
            props = aPrefix[i] + "Transition";
            if(temp.style[props] !== undefined){
                return "-" + aPrefix[i].toLowerCase()+"-";
            }
        }
        return false;
    })(document.createElement(PageSwitch));

    var PageSwitch = (function(){
        function PageSwitch(element,options){
            this.settings = $.extend(true,$.fn.PageSwitch.default,options||{});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init : function(){
                console.log(this);
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);
              
                me.direction = me.settings.direction =="vertical" ? true : false;
                me.pagesCount = me.pagesCount();
                me.canScroll = true;
                me.index = (me.settings.index>=0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;
                if(!me.direction){
                    me._initLayout();
                } 
                if(me.settings.pagination){
                    me._initPaging();
                }
                me._initEvent();
            },
            pagesCount : function(){
                return this.section.length;
            },
            switchLength : function(){
                return this.direction ? this.element.height():this.element.width();
            },
            prev : function(){
                    var me=this;
                    if(me.index > 0){
                        me.index --;
                    }else if(me.settings.loop){
                        me.index = me.pagesCount -1;       
                     }
                     me._scrollPage();
            },
            next : function(){
                    var me=this;
                    if(me.index < me.pagesCount){
                        me.index ++;
                    }else if(me.settings.loop){
                        me.index = 0;
                    }
                    me._scrollPage();
            },
            _initLayout : function(){
                var me = this;
                var width = (me.pagesCount * 100 ) + '%',
                cellWidth = (100/me.pagesCount).toFixed(2) + '%';
                me.sections.width(width);
                me.section.width(cellWidth).css("float","left");
            },
            _initPaging : function(){
                var me = this,pagesClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class=" + pagesClass + ">";
                for(var i=0;i<me.pagesCount;i+=1){
                    pageHtml += "<li></li>";
                } 
                pageHtml +="</ul>";
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(0).addClass('active');
                if(me.direction){
                    pages.addClass("vertical");
                }else{
                    pages.addClass("horizontal");
                }
            },
            _initEvent : function(){
                var me = this;
                me.element.on("click",me.selectors.pages + " li",function(){
                    me.index = $(this).index();
                    me._scrollPage();
                });

                me.element.on("mousewheel DOMMouseScroll",function(e){
                    if(me.canScroll){
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.wheelDelta;
                        if(delta > 0 && (me.index && !me.settings.loop || me.settings.loop)){
                            me.prev();
                        }else if(delta < 0 && (me.index <(me.pagesCount - 1)&& !me.settings.loop || me.settings.loop)){
                                me.next();
                        }
                    }
                });
                if(me.settings.keyword){
                    $(window).on("keyword",function(e){
                        var keyCode = e.keyCode;
                        if(keyCode == 37|| keyCode == 38){
                            me.prev();
                        }else if(keyCode == 39 || keyCode ==40){
                            me.next();
                        }
                    });
                }
                $(window).resize(function(){
                    var currentLength = me.switchLength(),
                    offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                    if(Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount -1)){
                        me.index ++;
                    }
                    if(me.index){
                        me._scrollPage();
                    }
                });
                me.sections.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
                    me.canScroll = true;
                    if(me.settings.callback && $.type(me.settings.callback)=="function"){
                        me.settings.callback();
                    }
                })
            },
            _scrollPage : function(){
                var me = this,
                dest = me.section.eq(me.index).position();
                if(!dest) return;
                me.canScroll = false;
                if(_prefix){
                    me.sections.css(_prefix + "transition","all " + me.settings.duration + "ms "+ me.settings.easing);
                    var translate = me.direction ? "translateY(-" + dest.top + "px" : "translateX(-" + dest.left + "px)";
                        me.sections.css(_prefix + "transform",translate);
                }else{
                    var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
                    me.sections.animate(animateCss, me.settings.duration,function(){
                        me.canScroll = true;
                        if(me.settings.callback && $.type(me.settings.callback)=="function"){
                        me.settings.callback();
                    }
                    })
                }
                if(me.settings.pagination){
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
                }
            }
        };
        return PageSwitch;
    })();
    $.fn.PageSwitch = function(options){
        console.log('star')
        return this.each(function(){
            var me = $(this),
                instance = me.data("PageSwitch");
                if(!instance){
                    instance = new PageSwitch(me, options);
                    me.data("PageSwitch", instance);
                }
                if($.type(options)==="string") return instance[options]();
        });
    }
    $.fn.PageSwitch.default = {
        selectors : {
            sections : ".sections",
            section : ".section",
            page : ".page",
            active : ".active"
        },
        index : 0,//起始页面
        easing : "ease", //动画曲线
        duration : 500,//动画延迟
        loop : false,
        pagination : true,//是否支持分页
        keyword : true,//是否支持键盘控制
        direction : "vertical",//控制方向横：horizontal 竖：vertical
        callback : ''//回调函数
    };
     $(function(){
            $("[data-PageSwitch]").PageSwitch({
                loop:true,
                direction:"horizontal",
                callback:function(){
                    
                }
            });
        });
})(jQuery);