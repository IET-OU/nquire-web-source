angular.module('senseItWeb', null, null).controller('ModalCtrl', function ($scope, $uibModalInstance, data, OpenIdService) {

    $scope.data = data;

    $scope.ok = function () {
        if (!data.ok || data.ok()) {
            $uibModalInstance.close('ok');
        }
    };

    $scope.okLabel = function () {
        return data.okLabel ? data.okLabel() : 'Ok';
    };

    $scope.okDisabled = data.okDisabled;

    $scope.editDisabled = data.editDisabled;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.close = function (callback) {
        $uibModalInstance.dismiss('cancel');
        if (callback) {
            return callback();
        }
    };

    OpenIdService.registerWatcher($scope);

});
