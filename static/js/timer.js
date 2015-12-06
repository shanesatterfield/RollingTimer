var app = angular.module('timerApp', ['ui']);

// This allows the Jinja2 template engine to work nicely with AngularJS's
// templating engine. The main problem is that they both use {{ variable }}.
// With this, use {[ variable ]} to access an AngularJS variable.
app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);

app.controller('TimerListController', function($scope) {

    $scope.timers = [
        { id: 0, time: '1 minute 30 seconds', valid: true },
        { id: 1, time: '1 minute 30 seconds',  valid: true },
        { id: 2, time: '1 minute 30 seconds', valid: true }
    ];

    $scope.tempTimer = {};
    var nextTimerID = 3;

    $scope.addTimer = function() {
        $scope.checkValid($scope.tempTimer);
        // if($scope.tempTimer.valid) {
            $scope.tempTimer.id = nextTimerID++;
            $scope.timers.push($scope.tempTimer);
            $scope.tempTimer = {}
        // }
    };

    $scope.checkValid = function(timer) {
        timer.valid = $scope.isValidTime(timer.time);
        var timerGroup = $('#timerGroup' + timer.id);
        if(timer.valid) {
            console.log(timerGroup)
            timerGroup.removeClass('has-error');
            timerGroup.addClass('has-success');
        }
        else {
            console.log('what')
            timerGroup.removeClass('has-success');
            timerGroup.addClass('has-error');
        }
    };

    // TODO: Set up a regex match for this.
    $scope.isValidTime = function(time) {
        return true;
    };

    $scope.deleteTimer = function(timer) {
        var index = $scope.timers.indexOf(timer);
        if(index > -1) {
            $scope.timers.splice(index, 1);
        }
    };

    // TODO: Actually add this functionality.
    $scope.startTimers = function() {

    };
});
