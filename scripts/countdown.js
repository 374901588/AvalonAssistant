// 关于时间倒计时的逻辑实现
var countdownTimeUnit = 60
const countdownTimeTxt = document.getElementById("countdown_time")
const countdownOptBtn = document.getElementById("countdown_opt")

var count = 0;
onCountdownPauseAndReset()

var isOptForStart = true

var timer = null

function tiggerTimer() {
  timer = setInterval(function() {
    count--;
    console.log(count);
    if(count<0) {
      onCountdownPauseAndReset()
    } else {
      updateCountdownTimeTxt(count);
    }
  }, 1000)
}

// 时间选择器事件监听
function onCountdownTimeChanged() {
  var selector = document.getElementById("countdown_time_selector");
  // 获取到选择的倒计时时间
  countdownTimeUnit = parseInt(selector.options[selector.selectedIndex].value);
  onCountdownPauseAndReset()
}

// 重置倒计时并暂停
function onCountdownPauseAndReset() {
  clearInterval(timer)
  timer = null
  count = countdownTimeUnit
  updateCountdownTimeTxt(count)
  isOptForStart = true
  countdownOptBtn.innerHTML = "开始"
}

function onCountdownOpt() {
  if(isOptForStart) {
    onCountdownStart()
    countdownOptBtn.innerHTML = "暂停"
  } else {
    onCountdownPause()
    countdownOptBtn.innerHTML = "开始"
  }
  isOptForStart = !isOptForStart
}

// 暂停倒计时
function onCountdownPause() {
  if(timer!=null) {
    clearInterval(timer)
  }
}

// 恢复倒计时
function onCountdownStart() {
  tiggerTimer()
}

function formatTime(time) {
  var min = Math.floor(time / 60);
  var sec = time % 60;
  return formatTimeTo2Num(min) + ":" + formatTimeTo2Num(sec);
}

function formatTimeTo2Num(time) {
  if(time<10) {
    return "0"+time
  } else {
    return String(time)
  }
}

function updateCountdownTimeTxt(time) {
  var txt = formatTime(count);
  console.log("updateCountdownTimeTxt: "+txt);
  countdownTimeTxt.innerHTML = txt;
}