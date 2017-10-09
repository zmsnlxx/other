// 获取画板元素
window.onload = function() {
    var c = document.getElementById('huaban');
    // 这个 HTML5的内建对象   通过这个对象可以 进行画的操作
    var ctx = c.getContext('2d');


    //1.获取id为huabi的标签，点击画笔(只点击画笔,不选取其他项)
    document.getElementById('huabi').onclick = function() {
        this.style.width = '60px';
        this.style.height = 35;
        this.style.lineHeight = '35px';
        this.style.color = 'white';
        this.style.background = 'black';
        //点击画笔，矩形标签的样式
        var r = document.getElementById('r');
        r.style.width = '50px';
        r.style.height = 30;
        r.style.lineHeight = '30px';
        r.style.color = 'black';
        r.style.background = '#ccc';
        //点击画笔，圆形标签的样式
        var a = document.getElementById('a');
        a.style.width = '50px';
        a.style.height = 30;
        a.style.lineHeight = '30px';
        a.style.color = 'black';
        a.style.background = '#ccc';
            
        //按下鼠标(鼠标事件)
        c.onmousedown = function() {
            //移动鼠标
            c.onmousemove = function(e) {
                // getBoundingClientRect():
                //  这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。
                // 分别表示元素各边与页面上边和左边的距离。

                // 定义画板的位置
                var rec = c.getBoundingClientRect();
                var x = e.offsetX * (c.width / rec.width)
                var y = e.offsetY * (c.height / rec.height)
                // 定义颜色，粗细的值
                var color = document.getElementById('color').value;
                var width = document.getElementById('width').value;
               //判断,(如果没有填写颜色,就按照初始的颜色值来开始进行绘画)
                if (color != '') {
                    ctx.fillStyle = color;
                    ctx.strokeStyle = color;
                }
                // beginPath() 方法在一个画布中开始子路径的一个新的集合
                ctx.beginPath(); 
                ctx.arc(x, y, width / 2, 0, 2 * Math.PI, true);
                // fill() 方法填充当前的图像（路径）。默认颜色是黑色。
                ctx.fill();
                // stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
                ctx.stroke();
                // 画笔松开后，事件为空
                c.onmouseup = function() {
                    c.onmousemove = null;
                }
            }
        }
    }
     

    //2. 点击矩形事件,所发生的样式改变
    document.getElementById('r').onclick = function() {
        this.style.width = '60px';
        this.style.height = 35;
        this.style.lineHeight = '35px';
        this.style.color = 'white';
        this.style.background = 'black';
        //点击矩形，画笔标签样式
        var huabi = document.getElementById('huabi');
        huabi.style.width = '50px';
        huabi.style.height = 30;
        huabi.style.lineHeight = '30px';
        huabi.style.color = 'black';
        huabi.style.background = '#ccc';
        // 点击矩形，圆形标签的样式
        var a = document.getElementById('a');
        a.style.width = '50px';
        a.style.height = 30;
        a.style.lineHeight = '30px';
        a.style.color = 'black';
        a.style.background = '#ccc';
        //手动
        // 鼠标按下(事件)
        c.onmousedown = function(e0) {
            // getBoundingClientRect()
            // 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。
            // 分别表示元素各边与页面上边和左边的距离。
             // 定义画板的位置
            var rec = c.getBoundingClientRect();
            var x0 = e0.offsetX * (c.width / rec.width)
            var y0 = e0.offsetY * (c.height / rec.height)
            // 鼠标松开事件，离开画板时发生的变化，根据所选的选项开展示绘画的路径
            c.onmouseup = function(e1) {
                var x1 = e1.offsetX * (c.width / rec.width)
                var y1 = e1.offsetY * (c.height / rec.height)
                var w = x1 - x0;
                var h = y1 - y0;
                var color = document.getElementById('color').value;
                var width = document.getElementById('width').value;
                // 判断，如果颜色不为空，绘画的颜色就为所选的颜色样式
                if (color != '') {
                    ctx.strokeStyle = color;
                }
                ctx.lineWidth = width;
                ctx.strokeRect(x0, y0, w, h);
            }
        }
        //自动
        // 点击确定事件，获取矩形的值
        document.getElementById('rbutton').onclick = function() {
            var x0 = document.getElementById('x0').value;
            var x1 = document.getElementById('x1').value;
            var y0 = document.getElementById('y0').value;
            var y1 = document.getElementById('y1').value;
            // 判断
            // 矩形的四个值都为空的话，就提示(警告)，否则,会根据选择的选项来绘画
            if ((x0 == '') || (x1 == '') || (y0 == '') || (y1 == '')) {
                alert('矩形信息不完善请补充')
            } else {
                var color = document.getElementById('color').value;
                var width = document.getElementById('width').value;
                if (color != '') {
                    ctx.strokeStyle = color;
                }
                ctx.lineWidth = width;
                ctx.strokeRect(x0, y0, x1, y1);
            }
        }
        // 点击清空按键的事件
        document.getElementById('del').onclick = function() {
            // 回复初值
            ctx.clearRect(0, 0, c.width, c.height);
        }
    }





    // 3.点击圆形按键
    document.getElementById('a').onclick = function() {
        
        this.style.width = '60px';
        this.style.height = 35;
        this.style.lineHeight = '35px';
        this.style.color = 'white';
        this.style.background = 'black';
        // 点击圆形按键，画笔标签的变化
        var huabi = document.getElementById('huabi');
        huabi.style.width = '50px';
        huabi.style.height = 30;
        huabi.style.lineHeight = '30px';
        huabi.style.color = 'black';
        huabi.style.background = '#ccc';
        // 点击圆形按键，矩形标签的变化
        var r = document.getElementById('r');
        r.style.width = '50px';
        r.style.height = 30;
        r.style.lineHeight = '30px';
        r.style.color = 'black';
        r.style.background = '#ccc';
        //手动
        // 画板
      // 鼠标按下(事件)
        c.onmousedown = function(e) {
            // // getBoundingClientRect()
            // 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。
            // 分别表示元素各边与页面上边和左边的距离。

             // 定义画板的位置
            var rec = c.getBoundingClientRect();
            var Ox = e.offsetX * (c.width / rec.width)
            var Oy = e.offsetY * (c.height / rec.height)
            // 松开画笔
            c.onmouseup = function(event) {
                var x = event.offsetX * (c.width / rec.width)
                var y = event.offsetY * (c.height / rec.height)
                var Or = Math.sqrt(Math.pow((x - Ox), 2) + Math.pow((y - Oy), 2))
                var color = document.getElementById('color').value;
                var width = document.getElementById('width').value;
                if (color != '') {
                    ctx.strokeStyle = color;
                }
                if (width != '') {
                    ctx.lineWidth = width;
                }
                   // beginPath() 方法在一个画布中开始子路径的一个新的集合。
                ctx.beginPath();
                  // x，y：圆心坐标； radius：半径；
                ctx.arc(Ox, Oy, Or, 0, 2 * Math.PI);
                   // stroke() 方法绘制当前路径。
                ctx.stroke();
            }
        }
        //自动
        // 点击确定按钮
        document.getElementById('abutton').onclick = function() {
            // 获取所选要画的圆的值
           //距离x轴的距离
            //距离y轴的距离
            //圆的半径
            var Ox = document.getElementById('Ox').value;
            var Oy = document.getElementById('Oy').value;
            var Or = document.getElementById('Or').value;
            // 判断语句
            if (Ox == '' || Oy == '' || Or == '') {
                alert('圆形信息不完善请补充')
            } else {
                var color = document.getElementById('color').value;
                var width = document.getElementById('width').value;
                if (color != '') {
                    ctx.strokeStyle = color;
                }
                if (width != '') {
                    ctx.lineWidth = width;
                }
                // beginPath() 方法在一个画布中开始子路径的一个新的集合。
                ctx.beginPath();
                // x，y：圆心坐标； radius：半径；
                ctx.arc(Ox, Oy, Or, 0, 2 * Math.PI);
                // stroke() 方法绘制当前路径。
                ctx.stroke();

            }

        }

    }

}