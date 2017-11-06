


angular.module('senseItWeb', null, null).controller('ProjectFilterSidebarCtrl', function ($scope, $state) {

    $scope.menuItemClass = function(key, value) {
        console.log(key, value, $state.params[key]);
        return ($state.params[key] || null) === value ? 'selected' : '';
    };
});
