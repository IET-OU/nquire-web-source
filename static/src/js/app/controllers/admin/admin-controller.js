angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, AdminService) {

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);

});