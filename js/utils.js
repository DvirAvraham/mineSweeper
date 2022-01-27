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

// bestTimeByLevel(easy)

// function bestTimeByLevel(level) {

//     if (typeof(Storage) !== "undefined") {
//         if (localStorage.bestTimeByLevel) {
//             localStorage.bestTimeByLevel = (localStorage.bestTimeByLevel < gBestScore) ? localStorage.bestTimeByLevel : gBestScore
//         } else {
//             localStorage.bestTimeByLevel = 100;
//         }
//         document.getElementById("result").innerHTML = `Best time on ${level} - ${localStorage.bestTimeByLevel} seconds`
//     }
// }