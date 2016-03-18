angular.module('senseItWeb', null, null).controller('AdminCtrl', function ($scope, $state, AdminService) {
    'use strict';

    $scope.adminAccess = function() {
        return $scope.status.logged && $scope.status.profile.admin;
    };

    AdminService.get($scope);


    /*! Useful admin utilities.
    */
    $scope.countClass = function (selector) {
        return angular.element(selector).length;
    };

    $scope.scrollTo = function (selector) {

      $('html, body').animate({
          scrollTop: $(selector).offset().top
      }, 1000);
    };

});
