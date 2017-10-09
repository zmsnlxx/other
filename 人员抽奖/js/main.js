var _btn = document.querySelector('#btnDal') //按钮
var _isDal = false //是否开始
var _timer //定时器
var arr = ["任大明", "晁针凯", "游倩倩", "付琦", "刘金帅", "王康", "李开心", "毕经群", "黄白寒", "赫永鹏", "柏海鹏", "王瑞", "催文豪", "孙孟", "刘艳博", "刘艳超", "贾殷", "贺世林", "代福田", "韩高远", "罗虎", "王振强", "李辉", "蒋永浩", "李鹏", "邱风云", "王洪辉", "王亚南", "李茂林", "刘想", "孔帅盟", "杨勇", "陈折", "徐国栋", "王文龙", "熊钊", "董世安", "周要辉"]
_btn.onclick = function(){
    if(_isDal){
        _isDal = false
        setTimeout(function(){
            clearInterval(_timer)
        },500)
        this.innerHTML = '开始'
        return false
    }
    else{
        _isDal = true
    }

   _timer =  setInterval(function(){
        var random = Math.floor(Math.random()*arr.length)
        var txt =  arr[random]
        document.querySelector('#lblName').innerHTML = txt
    },100)

    this.innerHTML = '停止'
}
