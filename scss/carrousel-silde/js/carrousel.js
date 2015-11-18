// Carrousel Class 封装控件，便于多次使用
// 首页分号可以鬼避上一个script结尾没有加分号的问题
;(function ($) {
  var Carrousel = function (poster) {
    var self = this;
    // ***默认配置参数以及扩展配置参数, 防止用户没有传递导致最终UI丑陋***
    // 保存单个旋转木马对象
    this.poster = poster;
    // 获取ul并保存，便于操作
    this.posterItemMain = poster.find('ul.poster-list');
    // 保存两个按钮对象
    this.prevBtn = poster.find('div.poster-prev-btn');
    this.nextBtn = poster.find('div.poster-next-btn');

    // 幻灯片的张数
    this.posterItems = poster.find('li.poster-item');

    // 当幻灯片为偶数张时，自动添加最后一张为第一张 ***慎用***
    if(this.posterItems.size()%2==0){
      this.posterItemMain.append(this.posterItems.eq(0).clone());
      this.posterItems = this.posterItemMain.children();
    };

    // 保存第一帧，即第ul下面的第一个li this.posterItems.eq(0)
    this.posterFirstItem = this.posterItems.first();
    // 保存最后一帧，便于前后旋转
    this.posterLastItem = this.posterItems.last();
    // 定义旋转标示，防止多次快速点击造成上一次动画没有结束引起混乱
    this.rotateFlag = true;

    this.setting = {
      "width": 1000,        //幻灯片的宽度
      "height": 270,        //幻灯片的高度
      "posterWidth": 640,   //幻灯片第一帧的宽度
      "posterHeight": 270,  //幻灯片第一帧的高度
      "scale": 0.9,         //记录显示比例关系
      "autoPlay": false,
      "delay": 5000,        //自动播放间隔时间
      "speed": 500,         //fast、slow、具体毫秒数
      "verticalAlign": "middle"  //middle、top、bottom
    };
    // 将用户传过来的参数覆盖默认的参数
    $.extend(this.setting, this.getSetting());
    
    // 设置幻灯片参数配置
    this.setSettingValue();
    this.setPosterPos();

    // 绑定右旋转
    this.nextBtn.click(function() {
      if (self.rotateFlag) {
        self.rotateFlag = false;
        self.carrouselRotate('left');
      }
    });
    // 绑定左旋转
    this.prevBtn.click(function() {
      if (self.rotateFlag) {
        self.rotateFlag = false;
        self.carrouselRotate('right');
      }
    });

    //是否开启自动播放
    if (this.setting.autoPlay) {
      this.autoPlay();
      this.poster.hover(function(){
        window.clearInterval(self.timer);
      }, function(){
        self.autoPlay();
      });
    };
  };

  Carrousel.prototype = {
    // 自动播放
    autoPlay: function() {
      var self = this;
      this.timer = window.setInterval(function(){
        self.nextBtn.click();
      }, this.setting.delay);
    },
    //旋转
    carrouselRotate: function( direction ) {
      var _this_ = this;
      var zIndexArr = [];
      if (direction === 'left') {
        this.posterItems.each(function() {
          var self = $(this),
              prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
              width = prev.width(),
              height = prev.height(),
              zIndex = prev.css('zIndex'),
              opacity = prev.css('opacity'),
              left = prev.css('left'),
              top = prev.css('top');
          zIndexArr.push(zIndex);
          self.animate({
            width: width,
            height: height,
            // zIndex: zIndex,
            opacity: opacity,
            left: left,
            top: top
          }, _this_.setting.speed, function() {
            _this_.rotateFlag = true;
          });
        });

        this.posterItems.each(function(i){
          $(this).css('zIndex', zIndexArr[i]);
        });
      } else if (direction === 'right'){
        this.posterItems.each(function() {
          var self = $(this),
              next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
              width = next.width(),
              height = next.height(),
              zIndex = next.css('zIndex'),
              opacity = next.css('opacity'),
              left = next.css('left'),
              top = next.css('top');
          zIndexArr.push(zIndex);
          self.animate({
            width: width,
            height: height,
            // zIndex: zIndex,
            opacity: opacity,
            left: left,
            top: top
          }, _this_.setting.speed, function() {
            _this_.rotateFlag = true;
          });
        });

        this.posterItems.each(function(i){
          $(this).css('zIndex', zIndexArr[i]);
        });
      };
    },

    // 获取人工配置参数
    getSetting: function() {
      var setting = this.poster.attr('data-setting');
      // 判断是否为空转化为json对象
      if (setting && setting !== '') {
        return $.parseJSON(setting);
      } else {
        return {};
      };
    },

    // 设置配置参数值去控制基本的宽度高度
    setSettingValue: function() {
      // 给P_Poster设置宽高
      this.poster.css({width: this.setting.width, height: this.setting.height});

      // 同样给P_Poster下面ul设置宽高
      this.posterItemMain.css({width: this.setting.width, height: this.setting.height});

      // 计算上下切换按钮的宽度 P_Poster的宽度减去第一帧（最前面一张图）的宽度除以2
      var w = (this.setting.width - this.setting.posterWidth)/2;

      this.prevBtn.css({width: w, height: this.setting.height, zIndex: Math.ceil(this.posterItems.size()/2)});
      this.nextBtn.css({width: w, height: this.setting.height, zIndex: Math.ceil(this.posterItems.size()/2)});

      // 设置第一帧的绝对位置，使其居中
      this.posterFirstItem.css({
        width: this.setting.posterWidth,
        height: this.setting.posterHeight,
        left: w,
        zIndex: Math.floor(this.posterItems.size()/2)
      });
    },

    // 设置垂直排列对齐
    setVerticalAlign: function( height ) {
      var varticalType = this.setting.verticalAlign,
          top = 0;
      if (varticalType === 'middle') {
        top = (this.setting.height - height)/2;
      } else if (varticalType === 'top'){
        top = 0;
      } else if (varticalType === 'bottom'){
        top = this.setting.height - height;
      } else {
        top = (this.setting.height - height)/2;
      };
      return top;
    },

    // 设置剩余的帧的位置关系
    setPosterPos: function() {
      var self = this;

      var sliceItems = this.posterItems.slice(1), //截取第一张，将剩下的幻灯片均分
          sliceSize = sliceItems.size()/2,
          rightSlice = sliceItems.slice(0, sliceSize),
          level = Math.floor(this.posterItems.size()/2),

          leftSlice = sliceItems.slice(sliceSize);
      var rw = this.setting.posterWidth,
          rh = this.setting.posterHeight,
          gap = ((this.setting.width - this.setting.posterWidth)/2)/level; //图片之间的间隙
      var firstLeft = (this.setting.width - this.setting.posterWidth)/2;
      // 固定变化值
      var fixOffsetLeft = firstLeft + rw;
      // 设置右边帧的位置关系和宽度高度top
      rightSlice.each(function(i){
        // 缩小
        level--;
        rw = rw * self.setting.scale;
        rh = rh * self.setting.scale;
        var j = i;
        $(this).css({
          zIndex: level,
          width: rw,
          height: rh,
          opacity: 1/(++j),
          left: fixOffsetLeft + (++i*gap) - rw,//***
          top: self.setVerticalAlign(rh),
        });
      });

      // 设置左边帧的位置关系和宽度高度top
      var lw = rightSlice.last().width(),
          lh = rightSlice.last().height(),
          oloop = Math.floor(this.posterItems.size()/2);

      leftSlice.each(function(i){
        $(this).css({
          zIndex: i,
          width: lw,
          height: lh,
          opacity: 1/oloop,
          left: i*gap, //很重要
          top: self.setVerticalAlign(lh),
        });
        // 放大
        lw = lw / self.setting.scale;
        lh = lh / self.setting.scale;
        oloop--;
      });
    },
  };
  // 初始化多个旋转木马对象
  Carrousel.init = function(posters) {
    // 保存 Carrousel 对象指针
    var _this_ = this;
    posters.each(function(){
      // 当前的this表示posters的每一个元素,即element
      // posters.each(function(i, element){}）
      new _this_($(this));
    });
  }
  // 全局注册，可以使首页的new Carrousel 起作用
  window['Carrousel'] = Carrousel;
})(jQuery);