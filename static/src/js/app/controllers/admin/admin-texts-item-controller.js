angular.module('senseItWeb', null, null).controller('AdminTextItemCtrl', function ($scope) {
    'use strict';

    // Translate help/about pages [Bug: #6]
    $scope.toggleTranslations = function () {
        // Not the angular way - refactor?
        angular.element(".admin-page-texts > table > tbody > tr.row-translate, .admin-page-texts .row-add-form")
            .toggleClass("ng-show");  //Was: $window.$(..).toggle("slow");

        $scope.alert.debug("toggleTranslations");
    };

    $scope.submit = function () {
        $scope.admin.setText($scope.text.key, $scope.text.value);

        $scope.log("Submitted: ", $scope.text);
    };


    if ($scope.item) {
        // ng-repeat context.
        $scope.form = new SiwFormManager($scope.txt, [$scope.item.id], function() {
            $scope.admin.setText($scope.item.id, $scope.txt[$scope.item.id]);
        });

        $scope.log("$scope.form (txt):", $scope.form, $scope.item);
    }

});
