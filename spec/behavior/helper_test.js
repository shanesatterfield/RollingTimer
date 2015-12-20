describe('Helper Functions Tests', function() {

    describe('renderTime', function() {

        var negativeStringExpected = '0s';

        it('should work on negative seconds only', function() {
            expect(renderTime(0, 20, -1)).toBe('20m 0s');
        });

        it('should work on negative seconds combined', function() {
            expect(renderTime(0, 0, -1)).toBe(negativeStringExpected);
        });

        it('should work on only negative hours', function() {
            expect(renderTime(10, -40, 20)).toBe('10h 20s');
        });

        it('should work on negative minutes combined', function() {
            expect(renderTime(0, -10, -30)).toBe(negativeStringExpected);
        });

        it('should work on only negative hours', function() {
            expect(renderTime(-20, 10, 20)).toBe('10m 20s');
        });

        it('should work on negative hours combined', function() {
            expect(renderTime(-20, -10, -445)).toBe(negativeStringExpected);
        });

    });

    describe('conjif', function() {
        var text = [' 12 asdf', 'hr', ' hr', 'hr ', ' h ', '', 'm ', 's '];

        it('should work on positive', function() {
            for(var i = 1; i < 1500; ++i) {
                text.forEach(function(item) {
                    expect(conjif(i, item)).toBe(i.toString() + item);
                });
            }
        });

        it('should give empty string on negative', function() {
            for(var i = -1500; i <= 0; ++i) {
                text.forEach(function(item) {
                    expect(conjif(i, item)).toBe('');
                });
            }
        });

    });

    describe('getRemainingTime', function() {
        function testGetRemainingTime(hr, min, sec) {
            hr  = Math.max(hr,  0),
            min = Math.max(min, 0),
            sec = Math.max(sec, 0);

            var expected = {
                total: timeToMilli(hr, min, sec),
                hr:    hr + (Math.floor(min / 60) + Math.floor(sec / 3600)),
                min:   (min + Math.floor(sec / 60) % 60) % 60,
                sec:   sec % 60
            };

            expected.text = renderTime(expected.hr, expected.min, expected.sec);
            expect(getRemainingTime(getEndTime(hr, min, sec))).toEqual(expected);
        }

        it('should work on 1 second', function() {
            testGetRemainingTime(0, 0, 1);
        });

        it('should work on positive minutes', function() {
            testGetRemainingTime(0, 55, 1);
        });

        it('should work on positive hours', function() {
            testGetRemainingTime(123, 0, 1);
        });

        it('should work on -1 seconds', function() {
            testGetRemainingTime(0, 0, -1);
        });

        it('should work on negative minutes', function() {
            testGetRemainingTime(0, -23, -1);
        });

        it('should work on negative hours', function() {
            testGetRemainingTime(-120, -23, -1);
        });

        it('should work on both positive and negatives', function() {
            testGetRemainingTime( 1230,  23, -1);
            testGetRemainingTime( 1230, -23, -1);
            testGetRemainingTime(-1230, -23, -1);

            testGetRemainingTime( 1230, -23,  1);
            testGetRemainingTime( 1230, -23, -1);
            testGetRemainingTime(-1230, -23, -1);

            testGetRemainingTime(-1230,  23,  1);
            testGetRemainingTime(-1230,  23, -1);
            testGetRemainingTime(-1230, -23, -1);
        });

        it('should work with large values', function() {
            testGetRemainingTime(   123123,       0,         0);
            testGetRemainingTime(        0, 1233453,         0);
            testGetRemainingTime(   123123, 1233453,         0);
            testGetRemainingTime(   123123, 1233453, 345345234);
            testGetRemainingTime(   123123,       0, 345345234);
            testGetRemainingTime(        0,       0, 345345234);
        });

    });

    describe('conjifSec', function() {
        var text = ['s ', 'asdf', ' 1234 fluffy '];

        it('should work on positive seconds', function() {
            for(var i = 0; i < 130; ++i) {
                text.forEach(function(item) {
                    expect(conjifSec(i, item)).toBe(i.toString() + item);
                });
            }
        });

        it('should work on positive seconds', function() {
            for(var i = -123; i <= 0; ++i) {
                text.forEach(function(item) {
                    expect(conjifSec(i, item)).toBe('0' + item);
                });
            }
        });
    });
});
