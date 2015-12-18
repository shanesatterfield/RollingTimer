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
    var time = end - new Date(),
        hr   = Math.floor((time/(60 * 60 * 1000)) % 60),
        min  = Math.floor((time/(60*1000)) % 60),
        sec  = Math.floor((time/1000) % 60);

    return {
        total: time,
        hr:  hr,
        min: min,
        sec: sec,
        text: renderTime(hr, min, sec)
    };
}
