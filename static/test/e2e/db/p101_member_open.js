exports.module = function () {
    angular.module('e2eDB', []).factory('e2eDbRequests', ['e2eDBCommon', function (e2eDBCommon) {
        return {
            requests: e2eDBCommon.requests(2, false, true, true)
        };
    }]);
};
