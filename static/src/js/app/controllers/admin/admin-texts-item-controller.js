angular.module('senseItWeb', null, null).controller('AdminTextItemCtrl', function ($scope, $log) {

    // Translate help/about pages [Bug: #6]
    $scope.toggleTranslations = function () {
        // Not the angular way - refactor?
        $(".admin-page-texts > table > tbody > tr[ data-row-lang != '' ], .row-add-form").toggle("slow");

        $log.log("toggleTranslations");
    }

    $scope.submit = function () {
        $scope.admin.setText($scope.text.key, $scope.text.value);

        $log.log("Submitted: ", $scope.text);
    }


    if ($scope.item) {
        // ng-repeat context.
        $scope.form = new SiwFormManager($scope.txt, [$scope.item.id], function() {
            $scope.admin.setText($scope.item.id, $scope.txt[$scope.item.id]);
        });
    }

});
