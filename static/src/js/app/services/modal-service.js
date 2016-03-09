
angular.module('senseItServices', null, null).factory('ModalService', ['$modal', function ($modal) {
    'use strict';

    return {
        open: function (data) {
            $modal.open({
                templateUrl: 'partials/widgets/modal-template.html',
                controller: 'ModalCtrl',
                size: data.size || 'sm',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        }
    };
}]);
