$(function(){
    $('.box .button').hover(function () {
    	//鼠标移上去时候提示框以动画形式显示出来，并且取到当前hover的提示框data-tip的值放到p标签里面去
        $(this).find('.tip').css('display','block').animate({'top':-50,'opacity':1},300).find('p').text($(this).attr('data-tip'));
    },function () {
    	//鼠标离开时的动画
        $(this).find('.tip').stop().css({'display':'none','opacity':0,'top':-100});
    })
})