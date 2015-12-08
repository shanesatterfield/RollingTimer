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
        { id: 1, time: '1 minute 30 seconds', valid: true },
        { id: 2, time: '2 hr 45 min 10 sec',  valid: true },
        { id: 3, time: '2 hours 10 minutes 30 seconds', valid: true }
    ];

    // $scope.timers = [];
    $scope.currTime = { hr: 0, min: 0, sec: 0 };
    $scope.endTime = -1;
    $scope.tempTimer = { id: 0 };

    var timeInterval;
    var nextTimerID = 3;
    var timerRegex = new RegExp("^(([0-9]+) (hour|Hour|hr|h)s{0,1}){0,1}?\\s*(([0-9]+) (minute|Minute|min|m)s{0,1}){0,1}?\\s*(([0-9]+) (second|Second|sec|s)s{0,1}){0,1}?$");

    $scope.addTimer = function() {
        $scope.checkValid($scope.tempTimer);
        if($scope.tempTimer.valid) {
            $scope.tempTimer.id = nextTimerID++;
            $scope.timers.push($scope.tempTimer);
            $scope.tempTimer = {id: 0}

            var timerGroup = $('#timerGroup' + $scope.tempTimer.id);
            timerGroup.removeClass('has-success');
            timerGroup.removeClass('has-error');
        }

    };

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

    $scope.isValidTime = function(time) {
        return time.match(timerRegex) != null;
    };

    $scope.deleteTimer = function(timer) {
        var index = $scope.timers.indexOf(timer);
        if(index > -1) {
            $scope.timers.splice(index, 1);
        }
    };

    // TODO: Actually add this functionality.
    $scope.startTimers = function() {
        var matches = timerRegex.exec($scope.timers[0].time)
        $scope.currTime = {
            hr:  parseInt(matches[2]) || 0,
            min: parseInt(matches[5]) || 0,
            sec: parseInt(matches[8]) || 0
        };

        $scope.endTime = new Date(new Date().getTime() + timeToMilli($scope.currTime.hr, $scope.currTime.min, $scope.currTime.sec));
        $scope.currTime = getRemainingTime($scope.endTime);
        timeInterval = setInterval(function() {
            $scope.currTime = getRemainingTime($scope.endTime);
            $scope.$apply();

            if($scope.currTime.total <= 0) {
                clearInterval(timeInterval);
            }
        }, 1000);
    };

    $scope.stopTimers = function() {

    };

    $scope.pause = function() {

    };

    $scope.unpause = function() {

    };
});

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
            $(elem).addClass('flipOutX').delay(1000).queue(function(next) {
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
