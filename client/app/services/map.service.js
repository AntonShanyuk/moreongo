/** @ngInject */
module.exports = function ($window, uiGmapGoogleMapApi, $q) {

    var that = this;

    this.requestLocation = function () {
        if ($window.navigator.geolocation) {
            return $q(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    resolve(position.coords);
                }, function () {
                    reject();
                });
            });
        } else {
            return reject();
        }
    }

    this.getAddress = function (position) {
        return uiGmapGoogleMapApi.then(function (maps) {
            var geocoder = new maps.Geocoder();

            return $q(function (resolve, reject) {
                geocoder.geocode({
                    location: {
                        lat: position.latitude,
                        lng: position.longitude
                    }
                }, function (address, status) {
                    if (address && address.length) {
                        resolve(address[0]);
                    } else {
                        reject();
                    }
                })
            });
        });
    }

    this.getPosition = function (address) {
        return uiGmapGoogleMapApi.then(function (maps) {
            var geocoder = new maps.Geocoder();
            return $q(function (resolve, reject) {
                geocoder.geocode({
                    address: address
                }, function (position) {
                    if (position && position.length) {
                        resolve(position[0].geometry.location);
                    } else {
                        reject();
                    }
                });
            });
        });
    }
}