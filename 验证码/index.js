// 生成验证码
function codes(n) {
    const a = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
    let b = "";
    for (let i = 0; i < n; i++) {
        let index = Math.floor(Math.random() * 62);
        b += a.charAt(index);
    }
    return b;
};
function show() {
    let result = codes(4);
    $('#login').html(result);
}
window.onload = show;
// 验证
function test() {
    const inputValue = $("#validate").val().toLowerCase();
    const primary = $('#login').html().toLowerCase();
    console.log(primary)
    if (inputValue == primary) {
        alert("通过验证");
    } else {
        alert("验证码错误,请重新输入");
        show();
    }
}



//验证手机号码
function checkPhone() {
    let phone = $('#phone').val();
    const pattern = /^1[0-9]{10}$/;
    isPhone = true;
    if (phone == '') {
        alert('请输入手机号码');
        isPhone = false;
        return;
    }
    if (!pattern.test(phone)) {
        alert('请输入正确的手机号码');
        isPhone = false;
        return;
    }
}

// 获取验证码
var isPhone = true;
function getCode(e) {
    checkPhone(); //验证手机号码
    if (isPhone) {
        resetCode(); //倒计时
    } else {
        $('#phone').focus();
    }
}

//倒计时
function resetCode() {
    let second = 5;
    let timer = null;
    $('#getcode').hide();
    $('#second').html(second);
    $('#resetcode').show();
    timer = setInterval(function () {
        second -= 1;
        if (second > 0) {
            $('#second').html(second);
        } else {
            clearInterval(timer);
            $('#getcode').show();
            $('#resetcode').hide();
        }
    }, 1000);
}