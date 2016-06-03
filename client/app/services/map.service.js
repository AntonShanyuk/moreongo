 /** @ngInject */
module.exports = function ($window, eventEmitter) {
    eventEmitter.inject(this);

    var that = this;
    this.setCircleLocation = function (position) {
        that.emit('circleLocationSet', position);
    }
    
    this.removeCircle = function(){
        that.emit('circleRemoved');
    }

    this.requestLocation = function (callback) {
        if ($window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                callback(position.coords);
            });
        }
    }
    
    this.userChangedCircleLocation = function(position){
        that.emit('circleLocationChanged', position);
    }
}