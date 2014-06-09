


angular.module('senseItWeb', null, null).controller('ProjectListCtrl', function ($scope, $state, ProjectService) {

    ProjectService.watchList($scope);
    $scope.projectListWatcher.query('all');

    $scope.testData = $scope.projectListWatcher.querySimple('senseit');

    $scope.projectClass = function(projectData) {
        return 'project-type-' + projectData.project.type;
    };

    $scope.projectTypeLabel = function(projectData) {
        switch (projectData.project.type) {
            case 'senseit':
                return 'Sense-it';
            case 'challenge':
                return 'Challenge';
            default:
                return 'Other';
        }
    };

    $scope.dataItemsTemplate = function(projectData) {
        return 'partials/project/data/project-data-' + projectData.project.type + '.html';
    };

    $scope.filter = null;
    $scope.setFilter = function(filter) {
        $scope.filter = filter;
    };

    $scope.filteredList = function() {
        if ($scope.filter) {
            var filtered = [];
            for (var i = 0; i < $scope.projectList.projects.length; i++) {
                if ($scope.projectList.projects[i].project.type == $scope.filter) {
                    filtered.push($scope.projectList.projects[i]);
                }
            }
            return filtered;
        } else {
            return $scope.projectList.projects;
        }
    };


});

