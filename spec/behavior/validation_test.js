////////////////
// Validation //
////////////////

describe('Validation', function() {
    beforeEach(module('timerApp'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    var $scope, controller;
    var startRange = 0,
        stopRange  = 102;

    beforeEach(function() {
        $scope = {};
        controller = $controller('TimerListController', {
            $scope: $scope
        });
    });

    function testValidRange(text) {
        for( var i = startRange; i < stopRange; ++i ) {
            expect($scope.isValidTime(i.toString() + text)).toBe(true);
        }
    }

    // Hours

    it('matches hour', function() {
        testValidRange(' hour');
        testValidRange(' Hour');
        testValidRange( 'hour');
        testValidRange( 'Hour');
    });

    it('matches hours', function() {
        testValidRange(' hours');
        testValidRange(' Hours');
        testValidRange( 'hours');
        testValidRange( 'Hours');
    });

    it('matches hr', function() {
        testValidRange(' hr');
        testValidRange(' Hr');
        testValidRange( 'hr');
        testValidRange( 'Hr');
    });

    it('matches hrs', function() {
        testValidRange(' hrs');
        testValidRange(' Hrs');
        testValidRange( 'hrs');
        testValidRange( 'Hrs');
    });

    it('matches h', function() {
        testValidRange(' h');
        testValidRange(' H');
        testValidRange( 'h');
        testValidRange( 'H');
    });

    // Minutes

    it('matches minute', function() {
        testValidRange(' minute');
        testValidRange(' Minute');
        testValidRange( 'minute');
        testValidRange( 'Minute');
    });

    it('matches minutes', function() {
        testValidRange(' minutes');
        testValidRange(' Minutes');
        testValidRange( 'minutes');
        testValidRange( 'Minutes');
    });

    it('matches min', function() {
        testValidRange(' min');
        testValidRange(' Min');
        testValidRange( 'min');
        testValidRange( 'Min');
    });

    it('matches mins', function() {
        testValidRange(' mins');
        testValidRange(' Mins');
        testValidRange( 'mins');
        testValidRange( 'Mins');
    });

    it('matches m', function() {
        testValidRange(' m');
        testValidRange(' M');
        testValidRange( 'm');
        testValidRange( 'M');
    });

    // Seconds

    it('matches seconds', function() {
        testValidRange(' seconds');
        testValidRange(' Seconds');
        testValidRange( 'seconds');
        testValidRange( 'Seconds');
    });

    it('matches seconds', function() {
        testValidRange(' seconds');
        testValidRange(' Seconds');
        testValidRange( 'seconds');
        testValidRange( 'Seconds');
    });

    it('matches sec', function() {
        testValidRange(' sec');
        testValidRange(' Sec');
        testValidRange( 'sec');
        testValidRange( 'Sec');
    });

    it('matches secs', function() {
        testValidRange(' secs');
        testValidRange(' Secs');
        testValidRange( 'secs');
        testValidRange( 'Secs');
    });

    it('matches s', function() {
        testValidRange(' s');
        testValidRange(' S');
        testValidRange( 's');
        testValidRange( 'S');
    });
});
