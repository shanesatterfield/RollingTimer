var app = angular.module('timerApp', ['ngAnimate']);

// This allows the Jinja2 template engine to work nicely with AngularJS's
// templating engine. The main problem is that they both use {{ variable }}.
// With this, use {[ variable ]} to access an AngularJS variable.
app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);

app.controller('TimerListController', function($scope) {
    // A list of the timers.
    $scope.timers = [];

    // The current amount of time left in the count down.
    $scope.currTime = { total: 0, hr: 0, min: 0, sec: 0, text: '0s' };

    // The end datetime that needs to be reached.
    $scope.endTime = -1;

    // The timer data corresponding to the original form input.
    $scope.tempTimer = { id: 0, name: '', time: '' };

    // Interval object that corresponds to the timer update function that runs
    // every 100ms.
    var timeInterval;

    // The next id that would be assigned. Used for generating unique ids.
    var nextTimerID = 3;

    // The regex object used to check for validation of timer strings and for
    // extracting the timer data from the timer string.
    var timerRegex = new RegExp("^(([0-9]+)\\s*(hour|Hour|hr|Hr|h|H)s{0,1}){0,1}?\\s*(([0-9]+)\\s*(minute|Minute|min|Min|m|M)s{0,1}){0,1}?\\s*(([0-9]+)\\s*(second|Second|sec|Sec|s|S)s{0,1}){0,1}?$");

    // SoundJS initialization
    var soundID = 'alarm';
    var isPlaying = false;
    var soundInst;
    createjs.Sound.registerSound('/static/assets/alarm.mp3', soundID);
    var ppc = new createjs.PlayPropsConfig().set({ interrupt: createjs.Sound.INTERRUPT_ANY, startTime: 0, duration: 2000 });

    // Pausing
    var paused = false;
    var pausedTime = 0;

    $scope.previousTimer = {};
    $scope.bannerText = $('#banner').text();

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
        $scope.tempTimer = { id: 0, name: '', time: '' };

        // Remove any form validation css classes.
        $('#timerGroup' + $scope.tempTimer.id)
            .removeClass('has-success')
            .removeClass('has-error');
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
            $('#timer-view').attr('class', 'animated').show().addClass('bounceIn').delay(700).queue(function(next) {
                $(this).removeClass('bounceIn');
                next();
            });

            $scope.startNewTimer();

            // Set the function to run and update the timer at an interval of
            // 100 ms so that it is more accurate. Otherwise it will jump
            // seconds sometimes.
            timeInterval = setInterval(function() {
                if(paused == false) {
                    // Update the current time remaining.
                    $scope.currTime = getRemainingTime($scope.endTime);

                    // When the there is less than 1000 ms left, note that this is
                    // so that the timer ends after the 1 sec mark is gone,
                    // stop the timer and move onto the next one.
                    if($scope.currTime.total <= 100) {
                        // If the alarm is not already playing, start playing it.
                        if(isPlaying == false) {

                            // Play the alarm and when done, move onto the next timer.
                            soundInst = $scope.playAlarm();
                            soundInst.on('complete', function() {
                                // TODO: Fix this. Known bug when pausing when the alarm is playing.
                                if($scope.timers.length <= 0) {
                                    $scope.stopTimers();
                                }
                                else {
                                    $scope.startNewTimer();
                                }

                                // The alarm is no longer playing.
                                isPlaying = false;
                                $('#timer-view').attr('class', 'animated');
                            });
                            isPlaying = true;
                        }
                        else {
                            $scope.currTime = { total: 0, hr: 0, min: 0, sec: 0, text: '0s' };
                            $('#timer-view > h1').addClass('infinite pulse').delay(2500).queue(function(next) {
                                $(this).removeClass('infinite pulse');
                                next();
                            });
                        }
                    }

                    // Tell Angular to update bindings in the html.
                    $scope.$digest();
                }
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
            $scope.endTime = new Date(new Date().getTime() + timeToMilli($scope.currTime.hr, $scope.currTime.min, $scope.currTime.sec));

            // Get the remaining time between now and the ending time.
            $scope.currTime = getRemainingTime($scope.endTime);

            // Move onto the next timer.
            $scope.previousTimer = $scope.timers[0];
            $scope.timers.shift();

            var textLength = Math.max($scope.currTime.text.length.toString(), 11);
            $('#timer-view > h1').css('font-size', textLength.toString() + 'vw');
            console.log($('#timer-view > h1').css('font-size'), Math.floor(100 / $scope.currTime.text.length).toString());
            $('#banner').html($scope.previousTimer.name).addClass('rubberBand').delay(1000).queue(function(next) {
                $(this).removeClass('rubberBand');
                next();
            });
        }
    };

    // Stops timers and the interval object. It also resets objects to default
    // values and activates the leave animation for the timer view div.
    $scope.stopTimers = function() {
        $scope.currTime = { hr: 0, min: 0, sec: 0, text: '0s' };
        $scope.endTime  = 0;
        clearInterval(timeInterval);
        // $scope.$digest();

        if(soundInst) {
            soundInst.stop();
        }

        $('#timer-view').attr('class', 'animated').addClass('bounceOut').delay(700).queue(function(next) {
            $(this).hide();
            next();
        });

        $('#banner').html($scope.bannerText).addClass('rubberBand').delay(1000).queue(function(next) {
            $(this).removeClass('rubberBand');
            next();
        });
    };

    // Use this to pause and unpause the timer when the pause/play button is clicked.
    $scope.pauseToggle = function() {
        var pauseButton = $('#pause-icon');
        if(paused) {
            $scope.unpause();
            pauseButton.removeClass('fa-play').addClass('fa-pause');
        }
        else {
            $scope.pause();
            pauseButton.removeClass('fa-pause').addClass('fa-play');
        }
    };

    $scope.pause = function() {
        paused = true;
        pausedTime = new Date();
        if(soundInst) {
            soundInst.stop();
            isPlaying = false;
        }
    };

    $scope.unpause = function() {
        $scope.endTime = new Date($scope.endTime.getTime() + new Date().getTime() - pausedTime);
        paused = false;
    };

    $scope.restart = function() {
        $scope.timers.unshift($scope.previousTimer);
        $scope.startNewTimer();
        isPlaying = false;
        if(paused == false) {
            $scope.pauseToggle();
        }
    };

    $scope.playAlarm = function() {
        return createjs.Sound.play(soundID, ppc);
    };
});
