const shutter = document.querySelector('.shutter');
const btn = document.querySelector('button');

btn.onclick = () => {
  // toggle() 方法切换元素的可见状态。
// 如果被选元素可见，则隐藏这些元素，如果被选元素隐藏，则显示这些元素。
// classList.toggle:元素切换类:
  shutter.classList.toggle('open');
};