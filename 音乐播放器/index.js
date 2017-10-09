// 音乐列表
var list=[{"name":"知道不知道","singer":"刘若英","src":"知道不知道.mp3","pic":"lry.jpg"},
          {"name":"传奇","singer":"王菲","src":"传奇.mp3","pic":"wf.png"}]

// 播放函数,参数item是播放的哪首音乐
function play(item){
    $('main').css({'background-image':'url('+item.pic+')'}).find('header h1').html(item.name).siblings().html(item.singer)
    $('time').html('00:00')
    $('progress').eq(0).attr('value',0)
    var player = $('#player')[0];
    $('#player').attr('src',item.src)
    console.log(player)
    player.play()
}

var current=0;   // 记录当前播放第几首歌
$('#player').attr('volume',1);   //设置播放时的音量
play(list[current])   // 执行播放

// 点击上一首时的操作函数
$('#play span').eq(0).click(function(){
   current--;
    if(current<0){
        current=list.length-1;     
    }
play(list[current])
    
})

// 判断暂停或者播放时的操作
$('#play span').eq(1).click(function(event){
    var player = $('#player')[0];
    if(player.paused){
        player.play();
        $(event.target).removeClass('glyphicon glyphicon-play').addClass('glyphicon glyphicon-pause')
    }else{
        player.pause();
        $(event.target).removeClass('glyphicon glyphicon-pause').addClass('glyphicon glyphicon-play')
    }
})

// 点击下一首时的操作函数
$('#play span').eq(2).click(function(){
   current++;
    if(current>list.length-1){
        current=0
    }
   play(list[current])
})

// 音量设置，音量减,volume:音量的意思,可以设置音频的音量，值在0~1之间
$('#volume span').eq(0).click(function(){
    var player = document.getElementById("player");
    // var preVolume=document.querySelector('progress').value;
    if(player.volume > 0 ){
        player.volume -=0.1;
    } else{
        player.volume =0;
    }
    console.log(player.volume);
})

// 音量加
$('#volume span').eq(1).click(function(){
    var player = document.getElementById("player");
    if(player.volume < 1 ) {
        player.volume +=0.1 ;
    }else{
        player.volume =1 ;
    }
    console.log(player.volume);
})

var player =document.querySelector('#player');
// 给音频播放器添加事件监听,修改进度条和时间
// timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
player.addEventListener('timeupdate',timeupdate);
function timeupdate(){
    // 修改进度条状态
    var progress = document.getElementsByTagName("progress")[0];
    progress.value = player.currentTime/player.duration;
    // 修改时间
    var seconds=Math.floor(player.currentTime%60);
    seconds=seconds<10 ? '0'+seconds :seconds;
    var minutes=Math.floor(player.currentTime/60);
    minutes=minutes<10 ? '0'+minutes :minutes;
    $('time').html(minutes+':'+seconds)
}

// 给音频播放器添加事件监听,当音频声音的大小发生改变时，修改音量进度条的值
// volumechange 事件在音频/视频（audio/video）的音量发生改变时触发
 player.addEventListener("volumechange",volumeChange);
 function volumeChange(){
     var progress =  document.getElementsByTagName("progress")[1];
     progress.value = player.volume;
 }

// 一首歌播放结束后，自动播放下一首
// ended 事件在音频/视频(audio/video)播放完成后触发
player.addEventListener("ended",next);

function next(){
     current++;
    if(current>list.length-1){
        current=0
    }
   play(list[current])
}

