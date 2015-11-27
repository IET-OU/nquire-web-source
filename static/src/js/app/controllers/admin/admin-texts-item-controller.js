angular.module('senseItWeb', null, null).controller('AdminTextItemCtrl', function ($scope) {

    // Translate help/about pages [Bug: #6]
    $scope.toggleTranslations = function () {
        // Not the angular way - refactor?
        $(".admin-page-texts > table > tbody > tr[ data-row-lang != '' ], .admin-page-texts .row-add-form")
            .toggle("slow");

        $scope.log("toggleTranslations");
    }

    $scope.submit = function () {
        $scope.admin.setText($scope.text.key, $scope.text.value);

        $scope.log("Submitted: ", $scope.text);
    }


    if ($scope.item) {
        // ng-repeat context.
        $scope.form = new SiwFormManager($scope.txt, [$scope.item.id], function() {
            $scope.admin.setText($scope.item.id, $scope.txt[$scope.item.id]);
        });
    }

});
