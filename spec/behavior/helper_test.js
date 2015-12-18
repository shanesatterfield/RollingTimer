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

});
