angular.module('senseItWeb', null, null).controller('AdminProjectsItemCtrl', function ($scope, $timeout) {

    if ($scope.project) {

        // ng-repeat context.
        $scope.form = new SiwFormManager($scope.admin.data.projects, [ $scope.project.id ], function () {
            var idx = $scope.project._idx
              , projects = $scope.admin.data.projects
              , filters = projects[ idx ].filters;

            var count = $scope.tags.setMissingTags(filters, $scope.admin.setFilter);
            if (count) {
                $timeout(function () {
                    $scope.tags.getList();
                }, 1500);
                $scope.alert.success('Tags successfully added', count);
            }

            $scope.admin.setProjectFilter(projects[ idx ].id, filters);

            $scope.log("Project filter updated: ", $scope, projects[ idx ]);
        });
    }

});
