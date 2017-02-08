
angular.module('senseItServices', null, null).factory('ModalService', ['$uibModal', function ($uibModal) {
    // Was: '$modal'

    'use strict';

    return {
        open: function (data) {
            $uibModal.open({
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
