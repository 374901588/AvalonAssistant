// 游戏记录相关逻辑

const recordTableBody = document.getElementById("record_table_tbody")

var roundTxtMap = {
    1: "Ⅰ",
    2: "Ⅱ",
    3: "Ⅲ",
    4: "Ⅳ",
    5: "Ⅴ",
};

// TODO
//  1. 设置初始队长，以及自动设置首任湖仙的逻辑
//  2. 根据上一次的结果，动态设置 next_car_btn 按钮的文案
//  3. 默认生成第一轮第一局
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

// TODO 辅助判断当前局次是否已经完成
var isCurRoundEnd = false


// TODO 开启下一局/轮，文案可以设置为第 X 局第 X 轮
function onNextCar() {
    if (curRound >= 5) {
        alert("无法超过 5 局，请重新开始游戏")
        return;
    }

    // TODO 先校验上一轮次的结果有没有设置

    curRound++
    createNextCarElements(curRound, curTimesOfRound, isCurRoundEnd, playerNum)
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

    if(isNewRound) {
        tr.appendChild(getThForRound(round, isNewRound))
    } else {
        // TODO 当局占多行的逻辑还有问题
        var thRound = document.getElementById("round_"+round)
        if(thRound!=null) {
            thRound.ariaRowSpan = timesOfRound
        }
    }
    tr.appendChild(getThForTimesOfRound(timesOfRound))
    
    // 针对玩家设置当前轮次交互元素格
    for(var i = 1; i <= playerNum; i++) {
        tr.appendChild(getPlayerCell())
    }

    tr.appendChild(getCarRecordCell())
    tr.appendChild(getResultCell())

    recordTableBody.appendChild(tr)
}

function getThForRound(round, isNewRound) {
    var th = document.createElement("th")
    th.className = "record_table_theadth"
    th.id = "round_"+round
    th.innerHTML = roundTxtMap[round]
    return th
}

function getThForTimesOfRound(times) {
    var th = document.createElement("th")
    th.className = "record_table_theadth"
    th.innerHTML = times
    return th
}

// TODO 应该需要动态设置 id，方便做鼠标悬浮等交互
// 获取当前轮次玩家的格子元素
function getPlayerCell() {
    var th = document.createElement("th")
    th.className = "record_table_theadth"
    th.innerHTML = "X"
    return th
}

function getCarRecordCell() {
    var th = document.createElement("th")
    th.className = "record_table_theadth"
    th.innerHTML = "XXX"
    return th
}

function getResultCell() {
    var th = document.createElement("th")
    th.className = "record_table_theadth"
    th.innerHTML = "XXX"
    return th
}