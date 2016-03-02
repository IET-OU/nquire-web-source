angular.module('senseItWeb', null, null).controller('AdminUsersCtrl', function ($scope) {

    $scope.admin.getUsers();

    $scope.countClass = function (selector) {
        return angular.element(selector).length;
    };

    $scope.scrollTo = function (selector) {

      $('html, body').animate({
          scrollTop: $(selector).offset().top
      }, 2000);
    };

    $scope.actions = {
        setAdmin: function (userId, isAdmin) {
            $scope.admin.setAdmin(userId, isAdmin);
        }
    };

});
