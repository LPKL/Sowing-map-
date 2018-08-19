/**
 * Created by Administrator on 2018/8/19.
 */
(function ($) {
    function Banner(options) {
        let _default = {
            eventType: 'click',
            initIndex: 0,
            url:null,
            moveIn:'mouseover',
            moveOut:'mouseout'
        };
        options && $.each(options,function (index,item) {
            _default[index]=item;
            }
        );
        let $box=this,
            $img_box=$box.children('.img_box'),
            newsData=null,
            $imgList=null,
            $leftBtn=$box.find('.leftBtn'),
            $rightBtn=$box.find('.rightBtn'),
            $tipBox=$box.find('.tip_box'),
            $tipList=null,
            str='',
            tipStr='',
            n=null,
            timer=null,
            index=0;



        // 通过ajax获取数据      // 往页面添加数据
        (function () {
            $.ajax({
                url:_default.url,
                method:'GET',
                dataType:'json',
                async:false,
                success:function (result) {
                    newsData=result;
                    giveHtml();
                }
            })
            function giveHtml() {
                $.each(newsData,function (index,item) {
                    str+=`  <li>
            <img src="${item.pic}" alt="">
            <p>${item.title}</p>
        </li>`;
                   tipStr+=`<li class="${index==0?'current':''}">${index+1}</li>`
                });
                $img_box.html(str);
                $tipBox.html(tipStr);
                $imgList=$img_box.children('li');
                $tipList=$tipBox.children('li');
                // $imgList.eq(0).css('zIndex',10).siblings().css('zIndex',0);
                //让第一张图片显示在最上面
            }
            // 让n等于数据的长
            n=newsData.length;
        })();
        //让图片运动
        (function () {
            $imgList.eq(0).css({zIndex:10}).siblings().css({zIndex:0,opacity:0});
            autoPlay();
            eventFn();
            click();
            btn();
        })();
            function play() {
                if($box.running)return;
                // 开始进来以后赋值为true
                $box.running=true;
                index++;
                if(index==n){
                    index=0
                }
                if(index<=-1){
                    index=n-1
                }
                $tipList.eq(index).addClass('current').siblings().removeClass('current');
                $imgList.eq(index).css({zIndex:10}).
                siblings().css({zIndex:0});
                $imgList.eq(index).animate({opacity:1},1000,function () {
                    $(this).siblings().css({opacity:0});
                    // play执行完赋值为false
                    $box.running=false;
                })
            }
            // 自动运动
            function autoPlay() {
                timer=setInterval(function () {
                    play();
                },2000)
            }
            // 鼠标放上移开的事件
            function eventFn() {
                $box.on(_default.moveIn, ()=> {
                    clearInterval(timer);
                    $rightBtn.show();
                    $leftBtn.show();
                })
                $box.on(_default.moveOut,()=>{
                    $rightBtn.hide();
                    $leftBtn.hide();
                    autoPlay();
                })
            }
            // 左右按钮的点击事件
            function click() {
                $leftBtn.on(_default.eventType,()=>{
                    if($box.running)return;
                  index-=2;
                    play();
                })
                $rightBtn.on(_default.eventType,()=>{
                    play();
                })
            }
            // 下方小圆圈的点击事件
            function btn() {
                $tipList.on(_default.moveIn,function(){
                    let _this=$(this),
                        temp=_this.index();
                    index=temp-1;
                    play();
                })
            }
    }
        $.fn.extend({
            Banner: Banner
        })
})(jQuery);


