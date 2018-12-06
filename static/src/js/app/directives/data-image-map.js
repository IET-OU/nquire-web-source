angular.module('senseItWeb').directive('siwDataItemImageMap', [function () {
    return {


        controller: function ($scope, $element) {
            var item = $scope.item;
            var geolocation = item && item.geolocation && JSON.parse(item.geolocation);

            if (geolocation) {
                var center = new google.maps.LatLng(geolocation.lat, geolocation.lon);
                $element.css({
                    'height': '400px',
                    'margin-top': '20px'
                });
                $element.css('height', '400px');
                var map = new google.maps.Map($element[0], {
                    center: center,
                    zoom: 12
                });

                var marker = new google.maps.Marker({
                  position: center,
                  map: map
                });
            }
        }
    };
}
]);
