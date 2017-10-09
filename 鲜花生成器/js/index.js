canvas = document.getElementById('canvas')

// addEventListener():用于向指定事件添加句柄
// para1:必须，字符串指定事件名
// para2:必须，指定事件触发时执行的函数
// para3:可选，布尔值，指定事件是否在捕获或冒泡阶段执行
canvas.addEventListener("mousedown", doMouseDown, false)

// window.innerWidth、window.innerHeight:返回窗口的文档显示区的宽度和高度
w = canvas.width = window.innerWidth
h = canvas.height = window.innerHeight

//getContext：获取绘图环境的类型，指定二维绘图
ctx = canvas.getContext('2d')

// 定义全局变量
var fps = 30
var interval = 1000 / fps
var frame = 0
var sf = Math.min(w, h) / 1.5

// createRadialGradient():创建放射状渐变对象
// 用addColorStop():定义不同的颜色
var grd = ctx.createRadialGradient(w / 2, h / 2, 0, h / 2, w / 2, sf * 1.2)
grd.addColorStop(0, "rgba(255,255,255,.25)")
grd.addColorStop(1, cb(rand(200, 255), rand(200, 255), rand(200, 255), 25));


// 定义页面刚加载出来时的页面效果
var num_flowers = 7
    // 定义存储花朵的数组
var fs = []
    // 用于生成最初的七朵花
for (var i = 0; i < num_flowers; i++) {
    // 设置花朵的大小、花瓣等
    fs.push({ size: rand(1, 10), petals: rand(4, 12), rot: rand(-5, 5), c: [rand(100, 255), rand(100, 255), rand(100, 255)], x: w / 2, y: h / 2 })
}

// sort()用于对数组元素进行排序
// parseFloat()可以解析一个字符串，并返回一个浮点数
fs.sort(function(a, b) {
    return parseFloat(b.size) - parseFloat(a.size)
})

draw();

function draw() {
    setTimeout(function() {

        // requestAnimationFrame():可以直接调用，也可以通过window来调用，
        // 接收一个函数作为回调，返回一个ID值，
        // 通过把这个ID值传给window.cancelAnimationFrame()可以取消该次动画。
        window.requestAnimationFrame(draw);
        frame += 1;

        //清除 canvas
        // shadowBlur 属性设置或返回阴影的模糊级数。
        ctx.shadowBlur = 0;
        // fillStyle 属性设置或返回用于填充绘画的颜色、渐变或模式。
        ctx.fillStyle = grd;
        // fillRect():方法绘制“已填色”的矩形
        ctx.fillRect(0, 0, w, h);

        for (var i = 0; i < num_flowers; i++) {
            draw_flower(sf * fs[i].size / 10, fs[i].petals * 2, 0, fs[i].rot / 15, fs[i].c, fs[i].x, fs[i].y);
        }
    }, interval);
}

// 定义生成花朵的颜色，以及花朵的透明度
function cb(r, g, b, o) {
    return "rgba(" + r + "," + g + "," + b + "," + o + ")";
}

// 设置花朵的大小、花瓣等
function add_flower(_x, _y) {
    fs.push({ size: rand(1, 5), petals: rand(4, 12), rot: rand(-15, 15), c: [rand(100, 255), rand(100, 255), rand(100, 255)], x: _x, y: _y });
    // 花朵的个数加一
    num_flowers++;
}

// 将花朵显示出来
function draw_flower(_rad, _num_pts, init_angle, spin_vel, c, _x, _y) {

    ctx.shadowBlur = 50;
    ctx.lineWidth = 1;
    ctx.shadowColor = cb(c[0], c[1], c[2], 1);
    ctx.fillStyle = cb(c[0], c[1], c[2], .6);
    c2 = [Math.floor(c[0] / 1.6), Math.floor(c[1] / 1.6), Math.floor(c[2] / 1.6)];

    ctx.strokeStyle = cb(c2[0], c2[1], c2[2], 1);

    var pts = [];
    for (var i = 0; i <= _num_pts; i++) {
        var _a = (360 / _num_pts) * i + init_angle + frame * spin_vel;

        pts.push({ x: P2L(_rad, _a).x, y: P2L(_rad, _a).y });
    }

    for (var i = 1; i <= _num_pts; i += 2) {
        idx = i % _num_pts;
        ctx.beginPath();
        ctx.moveTo(_x, _y);
        ctx.bezierCurveTo(_x + pts[i - 1].x, _y + pts[i - 1].y, _x + pts[idx + 1].x, _y + pts[idx + 1].y, _x, _y);
        ctx.stroke();
        ctx.fill();
    }
}

// 定义花朵的初始大小,形状为圆形
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// 将花朵设置为圆形，并且设置花瓣间的角度和花瓣的长度
function P2L(r, angle) {
    var ret = { x: 0, y: 0 };

    // 设置花朵的方位
    ret.x = Math.cos(angle * Math.PI / 180) * r;
    ret.y = Math.sin(angle * Math.PI / 180) * r;
    return (ret);
}

// 鼠标按下时需要执行的函数
function doMouseDown(event) {
    var totalOffsetX = 0
    var totalOffsetY = 0
    var canvasX = 0
    var canvasY = 0
    var currentElement = this

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop
    }
    while (currentElement = currentElement.offsetParent) {
        canvasX = event.pageX - totalOffsetX
        canvasY = event.pageY - totalOffsetY

        // 定义生成花朵的位置，即当前鼠标按下的位置即为花朵的中心位置
        // 执行add_flower()方法，定义花朵的基本样式
        add_flower(canvasX, canvasY)
    }
}