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
        var emptyState = '';

        it('should work on correct hours', function() {
            expect(conjif(45, 'h ')).toBe('45h ');
        });

        it('should work on correct minutes', function() {
            expect(conjif(32, 'm ')).toBe('32m ');
        });

        it('should work on negative hours', function() {
            expect(conjif(-100, 'h ')).toBe(emptyState);
        });

        it('should work on negative minutes', function() {
            expect(conjif(-23, 'h ')).toBe(emptyState);
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
        })
    });

});
