angular.module('senseItWeb', null, null).controller('AdminFiltersCtrl', function ($scope) {


    $scope.submit = function () {
        $scope.admin.setFilter($scope.new_filter.label, $scope.new_filter.query);

        $scope.log("Filter submitted: ", $scope.new_filter);
    }


    if ($scope.item) {
        // ng-repeat context.
        $scope.form = new SiwFormManager($scope.tags.data.filters, [ $scope.item._idx ], function saveCallback(formValid) {
            var idx = $scope.item._idx
              , filters = $scope.tags.data.filters;

            $scope.admin.setFilter(filters[ idx ].label, filters[ idx ].query, filters[ idx ].id);

            $scope.log("Filter updated: ", $scope, filters[ idx ]);
        });

        $scope.log("$scope.form (f):", $scope.form, $scope.item);
    }


    $scope.log('AdminFiltersCtrl');
});
