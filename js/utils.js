'use strict'

var gWatchInterval
var gStartTime

function bombAudio() {
    var audio = new Audio('./audio/bomb.mp3');
    audio.play();
}

function oopsAudio() {
    var audio = new Audio('./audio/oops.mp3');
    audio.play();
}

function winnerrAudio() {
    var audio = new Audio('./audio/winner.wav');
    audio.play();
}

function idToLocation(id) {
    var locations = []
    var location = id.split('-')
    locations.push(location[0])
    locations.push(location[1])
    return locations
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


window.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1)
    gStartTime = Date.now()
}

function updateWatch() {
    var now = Date.now()
    var time = ((now - gStartTime) / 1000).toFixed(2)
    var elTime = document.querySelector('.time')
    elTime.innerText = time
}

function endStopWatch() {
    clearInterval(gWatchInterval)
    gWatchInterval = null
}


function bestTimeEasy() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.bestTimeByLevelEasy && gGame.secsPassed) {
            localStorage.bestTimeByLevelEasy = (+localStorage.bestTimeByLevelEasy < +gGame.secsPassed) ? localStorage.bestTimeByLevelEasy : gGame.secsPassed
        } else {
            localStorage.bestTimeByLevelEasy = 100;
        }
    }
    document.querySelector(".result1").innerHTML = `Best time - Easy - ${localStorage.bestTimeByLevelEasy} seconds`
}



function bestTimeHard() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.bestTimeByLevelHard && gGame.secsPassed) {
            localStorage.bestTimeByLevelHard = (+localStorage.bestTimeByLevelHard < +gGame.secsPassed) ? localStorage.bestTimeByLevelHard : gGame.secsPassed
        } else {
            localStorage.bestTimeByLevelHard = 100;
        }
    }
    document.querySelector(".result2").innerHTML = `Best time - Hard - ${localStorage.bestTimeByLevelHard} seconds`
}



function bestTimeExtreme() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.bestTimeByLevelExtreme && gGame.secsPassed) {
            localStorage.bestTimeByLevelExtreme = (+localStorage.bestTimeByLevelExtreme < +gGame.secsPassed) ? localStorage.bestTimeByLevelExtreme : gGame.secsPassed
        } else {
            localStorage.bestTimeByLevelExtreme = 100;
        }
    }
    document.querySelector(".result3").innerHTML = `Best time - Extreme - ${localStorage.bestTimeByLevelExtreme} seconds`
}