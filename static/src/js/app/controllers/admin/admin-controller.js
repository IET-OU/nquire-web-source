angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, $state, AdminService) {
    'use strict';

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);

    if ($scope.adminAccess()) {
        $scope.admin.getVersion($scope);
    } else {
        $scope.alert.debug('Not logged in admin.');
    }


    /*! Useful admin utilities.
    */
    $scope.countClass = function (selector) {
        return angular.element(selector).length;
    };

    $scope.scrollTo = function (selector) {

      // Requires jQuery.
      angular.element('html, body').animate({
          scrollTop: angular.element(selector).offset().top
      }, 1000);
    };

});
