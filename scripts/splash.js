var playerNum = 6

const txtNum = document.getElementById("txt_num")
txtNum.innerHTML = playerNum

// TODO 把参数传递到下个页面
function startGame() {
    window.open("main.html", '_self')
}

function minusPlayer() {
    if (playerNum <= 6) {
        return
    }

    playerNum--
    txtNum.innerHTML = playerNum
}

function plusPlayer() {
    if (playerNum >= 10) {
        return
    }

    playerNum++
    txtNum.innerHTML = playerNum
}