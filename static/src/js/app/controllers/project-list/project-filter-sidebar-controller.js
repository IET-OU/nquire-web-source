


angular.module('senseItWeb', null, null).controller('ProjectFilterSidebarCtrl', function ($scope, $state) {

    $scope.menuItemClass = function(key, value) {
        $scope.log(key, value, $state.params[ key ]);  // console.log(key, value, $state.params[key]);
        return ($state.params[ key ] || null) === value ? 'selected' : '';
    };
});
