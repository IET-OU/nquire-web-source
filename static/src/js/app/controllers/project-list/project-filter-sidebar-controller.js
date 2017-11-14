


angular.module('senseItWeb', null, null).controller('ProjectFilterSidebarCtrl', function ($scope, $state) {

    $scope.menuItemClass = function(key, value) {
        var selected = ($state.params[key] || null) === value &&
          (key !== "filter" || value !== null || !$state.params.tag);

        return selected ? 'selected' : '';
    };
});
