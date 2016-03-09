angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, $state, AdminService) {
    'use strict';

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);
});
