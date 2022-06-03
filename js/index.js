$(function(){
    $(window).scroll(function(){
        let scrollY = $(document).scrollTop();
        // console.log(scrollY);
        if(scrollY>200){
            $('#nav').slideDown(300)
            $('#main .main-left .one').addClass('current-left')
        }else{
            $('#nav').slideUp(300)
            $('#main .main-left .one').removeClass('current-left')
        }
        if(scrollY>600){
            $('#main .main-right').addClass('current-right')
        }else{
            $('#main .main-right').removeClass('current-right')
        }
    })

    $('.nav-center-search input').focus(function(){
        $('.nav-center-search .content').show()
        $('.nav-center-search .active').css('color','#ff8200')
    })
     $('.nav-center-search input').blur(function(){
        $('.nav-center-search .content').hide()
        $('.nav-center-search .active').css('color','#000')
    })

    $('.nav-center-four .nav-center-sun').click(function(){
        $('.nav-center-four .nav-center-sun').toggleClass('icon-yueliang')
        // $('body').toggleClass('active1')
        $('#main .main-center .main-left').toggleClass('active1')
    })

    //请求导航条接口数据
    $.ajax({
        url:'https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/nav',
        type:"get",
        success:function(res){
            // console.log(res.data);
            for(let i=0;i<res.data.length-1;i++){
                let oDiv = '<div>' + res.data[i]+'</div>'
                $('.main .main-top').append(oDiv);
            }
            let oIcon = '<div class="'+res.data[res.data.length-1]+'"></div>'
            $('.main .main-top').append(oIcon);
        },
        error:function(err){
            console.log('请求失败');
        }
    })
    //请求微博热搜
    $.ajax({
        url:"https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/hotsearch",
        type:"get",
        success:function(res){
            // console.log(res.hotsearch[0].number);
            // 根据number字段数量大小进行排列热搜
            function objSort(prop){
                return function(obj1,obj2){
                    var val1 = obj1[prop];
                    var val2 = obj2[prop];
                    if(!isNaN(Number(val1)) && !isNaN(Number(val2))){
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if(val1<val2){
                        return 1;
                    }else if(val1>val2){
                        return -1;
                    }else{
                        return 0
                    }
                }
            }
            let oArr = res.hotsearch.sort(objSort("number"));
            // console.log(oArr);
            // 将排序好的热搜数据遍历输出到页面中
            for(let i=0;i<oArr.length;i++){
                if(i<oArr.length-1){
                    let j = i+1;
                    let oDiv = `
                                    <div class="hot">
                                        <div class="iconfont icon-`+j+`"></div>
                                        <div>${oArr[i].title}</div>
                                        <div>${oArr[i].number}</div>
                                        <div>${oArr[i].icon}</div>
                                    </div>
                                `
                    $('#main .main-right-hotsearch').append(oDiv)
                }else{
                    let oDiv = `
                                    <div class="hot">
                                        <div class="iconfont icon-icon-test"></div>
                                        <div>${oArr[i].title}</div>
                                        <div>${oArr[i].number}</div>
                                        <div>${oArr[i].icon}</div>
                                    </div>
                                `
                    $('#main .main-right-hotsearch').append(oDiv)
                }
                
            };
            let complete = `<div class="complete">
                        查看完整热搜榜单
                    </div>`;
            $('#main .main-right-hotsearch').append(complete)
        },
        error:function(err){
            console.log('请求失败');
        }
    })

    // 无限滚动加载博文数据
    $.ajax({
        url:"https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/article",
        type:"get",
        success:function(res){
            // console.log(res);
            // 数据的分割函数
            loadArtile()
            //监听滚动条事件
            window.addEventListener('scroll',function(){
                var timer;
                var startTime = new Date();
                return function() {
                    var curTime = new Date();
                    if(curTime-startTime >=2000){
                        timer = setTimeout(function(){
                            loadArtile();
                        },500);
                        startTime = curTime;
                    }
                }
            }());
            function loadArtile(){
                let articleArr = res.article;
                let fiveArr = articleArr.splice(0,5);
                for(let i=0;i<fiveArr.length;i++){
                    let articleElement = `
                                        <div class="main-bottom">
                                            <div class="main-bottom-blog">
                                                <div class="title">
                                                    <div class="title-img">
                                                        <img src="${res.article[i].imgUrl}">
                                                        <span class="iconfont icon-renzheng"></span>
                                                    </div>
                                                    <div class="title-name">
                                                        <div class="title-name-top">
                                                            <span class="">${res.article[i].name}</span>
                                                            <span class="iconfont ${res.article[i].icon1}"></span>
                                                            <span class="iconfont ${res.article[i].icon2}"></span>
                                                            <span class="iconfont ${res.article[i].icon3}"></span>
                                                        </div>
                                                        <div class="title-name-hour">
                                                            20小时之前
                                                        </div>
                                                        <div class="title-name-show">
                                                            ${res.article[i].sign}
                                                        </div>
                                                    </div>
                                                    <div class="title-name-focus">
                                                        <span class="iconfont icon-jiahao1"></span>
                                                        关注
                                                    </div>
                                                </div>
                                                <div class="blog">
                                                    <div>
                                                        ${res.article[i].content}
                                                    </div>
                                                    <img src="${res.article[i].image1}">
                                                    <img src="${res.article[i].image5}">
                                                    <img src="${res.article[i].image3}">
                                                    <img src="${res.article[i].image6}">
                                                </div>
                                                <div class="share">
                                                    <div class="iconfont icon-fenxiang_2">
                                                        ${res.article[i].share}
                                                    </div>
                                                    <div class="iconfont icon-pinglun">
                                                        ${res.article[i].message}
                                                    </div>
                                                    <div class="iconfont icon-dianzan">
                                                        ${res.article[i].give}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `
                     $('#main .main-bottom-template').append(articleElement)
                }
            }
        },
        error:function(err){
            console.log('请求失败');
        }
    })
})