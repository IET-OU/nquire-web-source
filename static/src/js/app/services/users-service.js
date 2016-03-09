
angular.module('senseItServices', null, null).factory('UsersService', ['RestService', function (RestService) {
  'use strict';

  return {
    getProfile: function (uid) {
      return RestService.get('api/profiles/' + uid);
    }
  };
}]);
