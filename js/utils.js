'use strict'

function bombAudio() {
    var audio = new Audio('./audio/bomb.mp3');
    audio.play();
}

function LoserAudio() {
    var audio = new Audio('./audio/loser.mp3');
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