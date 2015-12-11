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
