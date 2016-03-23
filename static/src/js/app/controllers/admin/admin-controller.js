angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, $state, AdminService) {
    'use strict';

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);
    $scope.admin.getVersion($scope);


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
