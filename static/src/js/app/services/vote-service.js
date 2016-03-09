
angular.module('senseItServices', null, null).factory('VoteService', ['RestService', function (RestService) {
    'use strict';

    var service = {
        vote: function(path, vote) {
            return RestService.post(path, {value: vote.value});
        }
    };

    return service;
}]);
