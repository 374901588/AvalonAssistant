// 游戏记录相关逻辑

const recordTableBody = document.getElementById("record_table_tbody")
const resultFloatMenuBox = document.getElementById("result_float_menu_box")
const resultFloatMenuHidden = document.getElementById("result_float_menu_hidden")

const btnResultSuccess = document.getElementById("result_success_btn")
const btnResultFailed = document.getElementById("result_failed_btn")
const btnResultLost = document.getElementById("result_lost_btn")

const RESULT_SUCCESS = "成功"
const RESULT_FAILED = "失败"
const RESULT_LOST = "流局"

var successCount = 0

var roundTxtMap = {
    1: "Ⅰ",
    2: "Ⅱ",
    3: "Ⅲ",
    4: "Ⅳ",
    5: "Ⅴ",
};

// TODO
//  1. 设置初始队长，以及自动设置首任湖仙的逻辑
//  4. 开始新游戏的按钮

var playerNum = 6
// TODO 是否有湖中仙女
var hasLakeFairy = false

// 先生成局次、轮次列，然后根据游戏人数动态生成玩家列，以及最后的记录、结果列
var recordTableHeadTr = document.getElementById("record_table_theadtr")
for(var i=1; i<= playerNum; i++) {
    var th = document.createElement("th")
    th.innerHTML = "玩家 "+i
    th.className = "record_table_theadth"
    recordTableHeadTr.appendChild(th)
}

var thDriver = document.createElement("th")
thDriver.innerHTML = "记录"
thDriver.className = "record_table_theadth"
recordTableHeadTr.appendChild(thDriver)

var thResult = document.createElement("th")
thResult.innerHTML = "结果"
thResult.className = "record_table_theadth"
recordTableHeadTr.appendChild(thResult)

// 第 X 局
var curRound = 1
var curTimesOfRound = 1
createNextCarElements(curRound, curTimesOfRound, true, playerNum)

// TODO 开启下一局/轮，文案可以设置为第 X 局第 X 轮
function onNextCar(isLastLost) {
    if(isLastLost) {
        curTimesOfRound++
    } else {
        // 重置
        curTimesOfRound = 1
        curRound++
    }

    // TODO 先校验上一轮次的结果有没有设置
    createNextCarElements(curRound, curTimesOfRound, !isLastLost, playerNum)
}

/**
 * 创建下一局/轮需要的元素
 * @param {number} round 局次
 * @param {number} timesOfRound 轮次
 * @param {boolean} isNewRound 是否是新的一局
 * @param {number} playerNum 玩家人数
 */
function createNextCarElements(round, timesOfRound, isNewRound, playerNum) {
    var tr = document.createElement("tr")

    console.log("round: "+round)
    console.log("timesOfRound: "+timesOfRound)
    console.log("isNewRound: "+isNewRound)

    if(isNewRound) {
        tr.appendChild(getRoundTd(round, isNewRound))
    } else {
        var thRound = document.getElementById("round_"+round)
        console.log("thRound: "+"round_"+round)
        if(thRound != null) {    
            // 要注意 rowSpan 赋值为字符串类型   
            thRound.rowSpan = timesOfRound
        }
    }
    tr.appendChild(getTimesOfRoundTd(timesOfRound))
    
    // 针对玩家设置当前轮次交互元素格
    for(var i = 1; i <= playerNum; i++) {
        tr.appendChild(getPlayerCell())
    }

    tr.appendChild(getCarRecordCell())
    tr.appendChild(getResultCell(round, timesOfRound))

    recordTableBody.appendChild(tr)
}

function getRoundTd(round, isNewRound) {
    var td = document.createElement("td")
    td.className = "record_table_theadth"
    td.id = "round_"+round
    td.innerHTML = roundTxtMap[round]
    return td
}

function getTimesOfRoundTd(times) {
    var td = document.createElement("td")
    td.colSpan = 1
    td.className = "record_table_theadth"
    td.innerHTML = times
    return td
}

// TODO 应该需要动态设置 id，方便做鼠标悬浮等交互
// 获取当前轮次玩家的格子元素
function getPlayerCell() {
    var td = document.createElement("td")
    td.className = "record_table_theadth"
    td.innerHTML = "X"
    return td
}

function getCarRecordCell() {
    var td = document.createElement("td")
    td.className = "record_table_theadth"
    td.innerHTML = "XXX"
    return td
}

function getResultCell(round, times) {
    var td = document.createElement("td")
    td.className = "record_table_theadth"
    td.innerHTML = "空白"
    console.log(td.id)
    // 实现鼠标悬停
    td.onclick = function() { 
        onResultCellClick(td, round, times)
        td.onclick = null
    }
    return td
}

// TODO 如果是第 5 轮次，限制只有成功/失败两个选项
// TODO 如果好人已经赢到第三局，提示游戏结束，忽略后续逻辑
// 锁定事件，同时只能打开一个悬浮菜单
function onResultCellClick(td, round, times) {
    resultFloatMenuBox.style.display = 'flex';
    resultFloatMenuHidden.style.display = 'block';

    btnResultSuccess.onclick = function() {
        onResultOptBtnClick(RESULT_SUCCESS, td, round, times, false)
    };
    btnResultFailed.onclick = function() {
        onResultOptBtnClick(RESULT_FAILED, td, round, times, false)
    };
    btnResultLost.onclick = function() {
        onResultOptBtnClick(RESULT_LOST, td, round, times, true)
    };
}

function hideResultFloatMenu() {
    resultFloatMenuHidden.style.display = 'none';

    resultFloatMenuBox.style.display = 'none';
    // 关闭后恢复box到原来的默认位置
    resultFloatMenuBox.style.top = '200px';
    resultFloatMenuBox.style.left = '';
}

// TODO 判断成功/失败的次数，判断游戏是否可以结束了
function onResultOptBtnClick(resultStr, td, round, times, isLost) {
    if (curTimesOfRound >= 5 && resultStr == RESULT_LOST) {
        alert("第 5 轮强制发车，无法再流局")
        return
    }

    td.innerHTML = resultStr
    hideResultFloatMenu()

    if(resultStr == RESULT_SUCCESS) {
        successCount++
        // TODO 事件是阻塞的，需要等到弹窗消失才会往下走
        if(successCount >= 3) {
            alert("好人阵营已经达成胜利，请坏人阵营拍刀")
            return
        }
    }

    if (curRound >= 5 || round < curRound || times < curTimesOfRound) {
        return;
    }

    onNextCar(isLost)
}    