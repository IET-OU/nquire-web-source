angular.module('senseItWeb', null, null).controller('NavBarCtrl', function ($scope, $state, $stateParams, $window, $location) {

    $scope.params = $stateParams;

    $scope.$on('$destroy', $scope.$watch('params', function() {
        $scope.keyword = $scope.params.kw || null;
    }, true));

    $scope.active = function (state) {
        return $state.current.name.indexOf(state) === 0;
    };

    $scope.search = function() {
        $scope.params.kw = $scope.keyword || null;
        $state.go('home', $scope.params);
    };

    $scope.searchButtonAction = function() {
        if ($scope.params.kw) {
            $scope.keyword = "";
        }

        $scope.search();
    };


    // NOTE: 'data-ng-change' directive requires Angular 1.4+ !!
    /*$scope.switchLanguage = function (lang) {
        $scope.log("Switch lang: ", lang);
    };*/

    angular.element("body").on("change", "#lang select", function () {  //Was: $window.$()..
        var $select = angular.element("#lang select");

        $scope.log("Switch lang 2: ", $select.val());

        // We need low level '$window.location' for a full page reload!
        $window.location.href = $scope.cfg.base_url + $select.val() + "#" + $location.url();
    });

});
