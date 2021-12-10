// 游戏记录相关逻辑

const recordTableBody = document.getElementById("record_table_tbody")
const resultFloatMenuBox = document.getElementById("result_float_menu_box")
const resultFloatMenuHidden = document.getElementById("result_float_menu_hidden")

const btnResultSuccess = document.getElementById("result_success_btn")
const btnResultFailed1 = document.getElementById("result_failed1_btn")
const btnResultFailed2 = document.getElementById("result_failed2_btn")
const btnResultLost = document.getElementById("result_lost_btn")

const RESULT_SUCCESS = "成功"
const RESULT_FAILED_1 = "坏票 x1"
const RESULT_FAILED_2 = "坏票 x2"
const RESULT_LOST = "\\"

var successCount = 0

var roundTxtMap = {
    1: "Ⅰ",
    2: "Ⅱ",
    3: "Ⅲ",
    4: "Ⅳ",
    5: "Ⅴ",
};

// TODO
//  1. 如果有湖中仙女，在指定局数结束的时候，提醒玩家验人
//  2. 重新开始新游戏的按钮
//  3. 校验上车人数

var playerNum = 6
    // TODO 是否有湖中仙女
var hasLakeFairy = false

// 先生成局次、轮次列，然后根据游戏人数动态生成玩家列，以及最后的记录、结果列
let recordTableHeadTr = document.getElementById("record_table_theadtr")
for (let i = 1; i <= playerNum; i++) {
    let th = document.createElement("th")
    th.innerHTML = "玩家 " + i
    th.className = "record_table_theadth"
    th.ondblclick = function() {
        onSetTaskMember(curRound, curTimesOfRound, i)
    }
    recordTableHeadTr.appendChild(th)
}

let thDriver = document.createElement("th")
thDriver.innerHTML = "记录"
thDriver.className = "record_table_theadth"
recordTableHeadTr.appendChild(thDriver)

let thResult = document.createElement("th")
thResult.innerHTML = "结果"
thResult.className = "record_table_theadth"
recordTableHeadTr.appendChild(thResult)

// 第 X 局
var curRound = 1
var curTimesOfRound = 1
createNextCarElements(curRound, curTimesOfRound, true, playerNum)

showFirstCaptainFloatMenu(playerNum)

function onNextCar(isLastLost) {
    if (isLastLost) {
        curTimesOfRound++
    } else {
        // 重置
        curTimesOfRound = 1
        curRound++
    }

    createNextCarElements(curRound, curTimesOfRound, !isLastLost, playerNum)

    // TODO 设置下一轮车队长 icon
}

/**
 * 创建下一局/轮需要的元素
 * @param {number} round 局次
 * @param {number} timesOfRound 轮次
 * @param {boolean} isNewRound 是否是新的一局
 * @param {number} playerNum 玩家人数
 */
function createNextCarElements(round, timesOfRound, isNewRound, playerNum) {
    let tr = document.createElement("tr")

    console.log("round: " + round)
    console.log("timesOfRound: " + timesOfRound)
    console.log("isNewRound: " + isNewRound)

    if (isNewRound) {
        tr.appendChild(getRoundTd(round, isNewRound))
    } else {
        let thRound = document.getElementById("round_" + round)
        if (thRound != null) {
            thRound.rowSpan = timesOfRound
        }
    }
    tr.appendChild(getTimesOfRoundTd(round, timesOfRound, playerNum))

    // 针对玩家设置当前轮次交互元素格
    for (let i = 1; i <= playerNum; i++) {
        tr.appendChild(getPlayerCell(round, timesOfRound, i))
    }

    tr.appendChild(getCarRecordCell())
    tr.appendChild(getResultCell(round, timesOfRound))

    recordTableBody.appendChild(tr)
}

function getRoundTd(round, isNewRound) {
    let td = document.createElement("td")
    td.className = "record_table_theadth"
    td.id = "round_" + round
    td.innerHTML = roundTxtMap[round]
    return td
}

function getTimesOfRoundTd(round, times, playerNum) {
    let td = document.createElement("td")
    td.colSpan = 1
    td.className = "record_table_theadth"
    td.innerHTML = times
    td.ondblclick = function() {
        setAllPlayerCell(true, round, times, playerNum)
    }
    td.onclick = function() {
        setAllPlayerCell(false, round, times, playerNum)
    }
    return td
}

function setAllPlayerCell(isSupport, round, times, playerNum) {
    var visibility = isSupport ? "visible" : "hidden"
    for (let i = 1; i <= playerNum; i++) {
        let id = getPlayerCellSupportIconId(round, times, i)
        let cellIcon = document.getElementById(id)
        console.log("id: " + id)
        console.log("cellIcon: " + cellIcon)
        cellIcon.style.visibility = visibility
    }
}

// 获取当前轮次玩家的格子元素
function getPlayerCell(round, timesOfRound, index) {
    let td = document.createElement("td")
    td.className = "record_table_theadth"

    // 是否赞成当前任务的标记
    let supportIcon = document.createElement("img")
    supportIcon.id = getPlayerCellSupportIconId(round, timesOfRound, index)
    supportIcon.className = "player_support_icon_icon"
    supportIcon.src = "images/icon_support_task.svg"
    supportIcon.style.visibility = "hidden"

    td.onclick = function() {
        console.log("img.style.visibility: " + supportIcon.style.visibility)
        if (supportIcon.style.visibility == "visible") {
            supportIcon.style.visibility = "hidden"
        } else {
            supportIcon.style.visibility = "visible"
        }
    }

    // 是否是任务成员的标记
    let taskMemberIcon = document.createElement("img")
    taskMemberIcon.id = getTaskMemberTagIconId(round, timesOfRound, index)
    taskMemberIcon.className = "player_task_member_icon"
    taskMemberIcon.src = "images/icon_task_member.svg"
    taskMemberIcon.style.visibility = "hidden"

    // TODO 是否是车队长的标记
    let captainIocn = document.createElement("img")
    captainIocn.id = getCaptainTagIconId(round, timesOfRound, index)
    captainIocn.className = "captain_tag_icon"
    captainIocn.src = "images/icon_captain.svg"
    captainIocn.style.visibility = "hidden"

    td.appendChild(supportIcon)
    td.appendChild(taskMemberIcon)
    td.appendChild(captainIocn)

    return td
}

function getPlayerCellSupportIconId(round, timesOfRound, index) {
    return `support_${round}_${timesOfRound}_${index}`
}

function getTaskMemberTagIconId(round, timesOfRound, index) {
    return `member_${round}_${timesOfRound}_${index}`
}

function getCaptainTagIconId(round, timesOfRound, index) {
    return `captain_${round}_${timesOfRound}_${index}`
}

function getCarRecordCell() {
    let td = document.createElement("td")
    td.className = "record_table_theadth"
    td.innerHTML = "XXX"
    return td
}

function getResultCell(round, times) {
    let td = document.createElement("td")
    td.className = "record_table_theadth"
    console.log(td.id)
    td.onclick = function() {
        showResultFloatMenu(td, round, times)
        td.onclick = null
    }
    return td
}

function showResultFloatMenu(td, round, times) {
    resultFloatMenuBox.style.display = 'flex';
    resultFloatMenuHidden.style.display = 'block';

    btnResultSuccess.onclick = function() {
        onResultOptBtnClick(RESULT_SUCCESS, td, round, times, false)
    };
    btnResultFailed1.onclick = function() {
        onResultOptBtnClick(RESULT_FAILED_1, td, round, times, false)
    };
    btnResultFailed2.onclick = function() {
        onResultOptBtnClick(RESULT_FAILED_2, td, round, times, false)
    };
    btnResultLost.onclick = function() {
        onResultOptBtnClick(RESULT_LOST, td, round, times, true)
    };
}

function hideResultFloatMenu() {
    resultFloatMenuHidden.style.display = 'none';

    resultFloatMenuBox.style.display = 'none';
    // 关闭后恢复 box 到原来的默认位置
    resultFloatMenuBox.style.top = '200px';
    resultFloatMenuBox.style.left = '';
}

function onResultOptBtnClick(resultStr, td, round, times, isLost) {
    if (curTimesOfRound >= 5 && resultStr == RESULT_LOST) {
        alert("第 5 轮强制发车，无法再流局")
        return
    }

    td.innerHTML = resultStr
    hideResultFloatMenu()

    if (resultStr == RESULT_SUCCESS) {
        successCount++
        // TODO 事件是阻塞的，需要等到弹窗消失才会往下走
        if (successCount >= 3) {
            alert("好人阵营已经达成胜利，请坏人阵营拍刀")
            return
        }
    }

    if (curRound >= 5 || round < curRound || times < curTimesOfRound) {
        return;
    }

    onNextCar(isLost)
}

// TODO 根据轮次，校验当前轮次总的人数，不能超过指定人数
function onSetTaskMember(round, times, index) {
    console.log(`onSetTaskMember round:${round}, times:${times}, index:${index}`)
    let id = getTaskMemberTagIconId(round, times, index)
    let icon = document.getElementById(id)
    if (icon.style.visibility == "visible") {
        icon.style.visibility = "hidden"
    } else {
        icon.style.visibility = "visible"
    }
}

function showFirstCaptainFloatMenu(playerNum) {
    let box = document.getElementById("first_captain_float_menu_box")
    let hidden = document.getElementById("first_captain_float_menu_hidden")

    box.style.display = 'flex';
    hidden.style.display = 'block';

    let select = document.getElementById("first_captain_select");
    // 先移除所有子元素
    select.innerHTML = ""
    for (let i = 1; i <= playerNum; i++) {
        let opt = document.createElement("option")
        opt.value = i
        opt.innerHTML = "玩家 " + i

        if (i == 1) {
            opt.selected = true
        }

        select.append(opt)
    }

    let btn = document.getElementById("first_captain_confirm")
    btn.onclick = function() {
        let selectedPlayer = select.options[select.selectedIndex].value
        console.log("首任队长: 玩家" + selectedPlayer)
        initFirstCaptain(selectedPlayer)
        hideFirstCaptainFloatMenu()
    }
}

function initFirstCaptain(index) {
    // TODO 设置第一个队长图标，以及首任湖中仙女
    let id = getCaptainTagIconId(1, 1, index);
    let icon = document.getElementById(id);
    icon.style.visibility = "visible"
}

function hideFirstCaptainFloatMenu() {
    let box = document.getElementById("first_captain_float_menu_box")
    let hidden = document.getElementById("first_captain_float_menu_hidden")


    hidden.style.display = 'none';
    box.style.display = 'none';
    // 关闭后恢复 box 到原来的默认位置
    box.style.top = '200px';
    box.style.left = '';
}