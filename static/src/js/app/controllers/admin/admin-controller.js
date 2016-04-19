angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, $timeout, AdminService) {
    'use strict';

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);

    $timeout(function () {
        if ($scope.adminAccess()) {
            $scope.admin.getVersion($scope);
        } else {
            $scope.alert.debug('Not logged in admin.');
        }
    }, 800);


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
