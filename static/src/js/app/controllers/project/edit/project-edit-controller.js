angular.module('senseItWeb', null, null).controller('ProjectEditCtrl', function ($scope, $state, ProjectService) {

    $scope.templates.menu = null;

    $scope.deleteProject = function () {
        $scope.projectWatcher.deleteProject();
        ProjectService.deleteProject($scope.project.id).then(function () {
            $state.go('home');
        });
    };

});

