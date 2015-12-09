var app = angular.module('timerApp', ['ngAnimate']);

// This allows the Jinja2 template engine to work nicely with AngularJS's
// templating engine. The main problem is that they both use {{ variable }}.
// With this, use {[ variable ]} to access an AngularJS variable.
app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);

app.controller('TimerListController', function($scope) {

    $scope.timers = [
        { id: 1, time: '5s', valid: true },
        { id: 2, time: '2 hr 45 min 10 sec',  valid: true },
        { id: 3, time: '2 hours 10 minutes 30 seconds', valid: true }
    ];

    // $scope.timers = [];
    // The current amount of time left in the count down.
    $scope.currTime = { hr: 0, min: 0, sec: 0 };

    // The end datetime that needs to be reached.
    $scope.endTime = -1;

    // The timer data corresponding to the original form input.
    $scope.tempTimer = { id: 0, time: '' };

    // Interval object that corresponds to the timer update function that runs
    // every 100ms.
    var timeInterval;

    // The next id that would be assigned. Used for generating unique ids.
    var nextTimerID = 3;

    // The regex object used to check for validation of timer strings and for
    // extracting the timer data from the timer string.
    var timerRegex = new RegExp("^(([0-9]+)\\s*(hour|Hour|hr|h)s{0,1}){0,1}?\\s*(([0-9]+)\\s*(minute|Minute|min|m)s{0,1}){0,1}?\\s*(([0-9]+)\\s*(second|Second|sec|s)s{0,1}){0,1}?$");

    // SoundJS initialization
    var soundID = 'alarm';
    var isPlaying = false;
    createjs.Sound.registerSound('/static/assets/alarm.mp3', soundID);

    // Attempts to add the temp timer data as a new timer to the list.
    $scope.addTimer = function() {
        $scope.checkValid($scope.tempTimer);
        var validAddition = $scope.tempTimer.valid;
        if(validAddition) {
            $scope.tempTimer.id = nextTimerID++;
            $scope.timers.push($scope.tempTimer);
            $scope.resetTempTimer();
        }
        return validAddition;
    };

    // Resets the temp timer data to its default.
    $scope.resetTempTimer = function() {
        // Reset values of the temp timer.
        $scope.tempTimer = { id: 0, time: '' };

        // Remove any form validation css classes.
        var timerGroup = $('#timerGroup' + $scope.tempTimer.id);
        timerGroup.removeClass('has-success');
        timerGroup.removeClass('has-error');
    }

    // Checks if the timer string is a valid timer string. Adds form validation
    // styling accordingly.
    $scope.checkValid = function(timer) {
        timer.valid = $scope.isValidTime(timer.time);
        var timerGroup = $('#timerGroup' + timer.id);
        if(timer.valid) {
            timerGroup.removeClass('has-error');
            timerGroup.addClass('has-success');
        }
        else {
            timerGroup.removeClass('has-success');
            timerGroup.addClass('has-error');
        }
    };

    // The actual assertion for whether a timer string is valid.
    $scope.isValidTime = function(time) {
        return time.match(timerRegex) != null && time.length > 0;
    };

    // Deletes a timer from the list of timers.
    $scope.deleteTimer = function(timer) {
        var index = $scope.timers.indexOf(timer);
        if(index > -1) {
            $scope.timers.splice(index, 1);
        }
    };

    // Starts the list of timers. It runs until all timers have finished.
    $scope.startTimers = function() {
        // Add in the temp timer in case the user meant for that to be included.
        $scope.addTimer();
        $scope.resetTempTimer();

        // Only run if there are valid timers found.
        if($scope.timers.length > 0) {
            // Set the css classes for entering animations.
            $('#timer-view').removeClass('bounceOut');
            $('#timer-view').show().addClass('bounceIn').delay(700).queue(function(next) {
                $(this).removeClass('bounceIn');
                next();
            });

            $scope.startNewTimer();

            // Set the function to run and update the timer at an interval of
            // 100 ms so that it is more accurate. Otherwise it will jump
            // seconds sometimes.
            timeInterval = setInterval(function() {
                // Update the current time remaining.
                $scope.currTime = getRemainingTime($scope.endTime);

                // When the there is less than 1000 ms left, note that this is
                // so that the timer ends after the 1 sec mark is gone,
                // stop the timer and move onto the next one.
                if($scope.currTime.total <= 1000) {
                    // If the alarm is not already playing, start playing it.
                    if(isPlaying == false) {

                        // Play the alarm and when done, move onto the next timer.
                        $scope.playAlarm().on('complete', function() {
                            if($scope.timers.length <= 0) {
                                $scope.stopTimers();
                            }
                            else {
                                $scope.startNewTimer();
                            }

                            // The alarm is no longer playing.
                            isPlaying = false;
                            $('#timer-view').removeClass('infinite pulse');
                        });

                        isPlaying = true;
                    }
                    else {
                        $scope.currTime = { total: 0, hr: 0, min: 0, sec: 0 };
                        $('#timer-view').addClass('infinite pulse');
                    }
                }

                // Tell Angular to update bindings in the html.
                $scope.$digest();
            }, 100);
        }
    };

    // Starts the first timer in the list of timers then removes that timer.
    $scope.startNewTimer = function() {
        // Eliminate invalid timers.
        while($scope.timers.length > 0 && $scope.timers[0].valid == false) {
            $scope.timers.shift();
        }

        // Only run if there are timers left to be run.
        if($scope.timers.length > 0) {
            var matches = timerRegex.exec($scope.timers[0].time);
            $scope.currTime = {
                hr:  parseInt(matches[2]) || 0,
                min: parseInt(matches[5]) || 0,
                sec: parseInt(matches[8]) || 0
            };

            // Set the time that you approach. The time when it ends.
            $scope.endTime = new Date(new Date().getTime() + timeToMilli($scope.currTime.hr, $scope.currTime.min, $scope.currTime.sec + 1));

            // Get the remaining time between now and the ending time.
            $scope.currTime = getRemainingTime($scope.endTime);

            // Move onto the next timer.
            $scope.timers.shift();
        }
    };

    // Stops timers and the interval object. It also resets objects to default
    // values and activates the leave animation for the timer view div.
    $scope.stopTimers = function() {
        $scope.currTime = { hr: 0, min: 0, sec: 0 };
        $scope.endTime  = 0;
        clearInterval(timeInterval);
        $scope.$digest();

        $('#timer-view').removeClass('bounceIn');
        $('#timer-view').addClass('bounceOut').delay(700).queue(function(next) {
            $(this).hide();
            next();
        });
    };

    $scope.pause = function() {

    };

    $scope.unpause = function() {

    };

    $scope.playAlarm = function() {
        return createjs.Sound.play(soundID);
    };
});

// The animation for the timers entering and leaving.
app.animation('.repeated-anim', function() {
    var duration = 'fast';

    return {
        enter: function(elem, done) {
            $(elem).addClass('flipInX');
            return function(isCancelled) {
                if(isCancelled) {
                    jQuery(element).stop();
                }
            }
        },

        leave: function(elem, done) {
            $(elem).addClass('flipOutX').delay(700).queue(function(next) {
                done();
                next();
            });
            return function(isCancelled) {
                if(isCancelled) {
                    jQuery(element).stop();
                }
            }
        }
    }
});

//////////////////////
// Helper functions //
//////////////////////

function milliToTime(milli) {
    return {
        total: milli,
        hr:  Math.floor((milli/(60 * 60 * 1000)) % 60),
        min: Math.floor((milli/(60*1000)) % 60),
        sec: Math.floor((milli/1000) % 60)
    };
}

function timeToMilli(hours, minutes, seconds) {
    return hours * 3600000 + minutes * 60000 +  seconds * 1000;
}

function getRemainingTime(end) {
    var time = end - new Date();
    return {
        total: time,
        hr:  Math.floor((time/(60 * 60 * 1000)) % 60),
        min: Math.floor((time/(60*1000)) % 60),
        sec: Math.floor((time/1000) % 60)
    };
}
