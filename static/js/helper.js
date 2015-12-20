//////////////////////
// Helper functions //
//////////////////////

// Takes time in hours, minutes and seconds and creates a pretty string.
function renderTime(hr, min, sec) {
    return conjif(hr, 'h ') + conjif(min, 'm ') + conjifSec(sec, 's');
}

// Helper function that either conjoins two strings or returns an empty string
// depending on whether or not the first value is greater than 0.
function conjif(a, b) {
    if(a > 0)
        return a.toString() + b;
    return '';
}

function conjifSec(a, b) {
    if(a < 0)
        a = 0;
    return a.toString() + b;
}

function timeToMilli(hours, minutes, seconds) {
    return hours * 3600000 + minutes * 60000 +  seconds * 1000;
}

function getRemainingTime(end) {
    var time = new Date(end - new Date()),
        hr   = Math.floor((time.getTime()/(60 * 60 * 1000))),
        min  = time.getMinutes(),
        sec  = time.getSeconds();

    return {
        total: time.getTime(),
        hr:  hr,
        min: min,
        sec: sec,
        text: renderTime(hr, min, sec)
    };
}

// Returns a date object corresponding to a time ahead by the delta time.
function getEndTime(hr, min, sec) {
    hr  = Math.max(hr,  0),
    min = Math.max(min, 0),
    sec = Math.max(sec, 0);

    return new Date(new Date().getTime() + timeToMilli(hr, min, sec));
}
