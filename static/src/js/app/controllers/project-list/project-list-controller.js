


angular.module('senseItWeb', null, null).controller('ProjectListCtrl', function ($scope, $rootScope, $state, ProjectService) {

    ProjectService.watchList($scope);

    $rootScope.projectListFilter = $scope.projectListFilter = {
        type: $state.params.type,
        status: $state.params.status,
        filter: $state.params.filter, //|| $state.params.tag,
        tag:    $state.params.tag,
        kw: $state.params.kw,
        page: $state.params.page || "1",
        onlyFeatured: $state.params.filter !== 'all' && ! $state.params.tag,
        hasConditions: $state.params.type || $state.params.status || $state.params.kw
    };

    $scope.projectListWatcher.query($scope.projectListFilter);


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
                if ($scope.projectList.projects[i].project.type === $scope.filter) {
                    filtered.push($scope.projectList.projects[i]);
                }
            }
            return filtered;
        } else {
            return $scope.projectList.projects;
        }
    };

    var paginationData = {
        resultCount: 0,
        currentPage: 0,
        items: []
    };

    $scope.pagination = function() {
        if ($scope.projectList.resultCount !== paginationData.resultCount || $scope.projectListFilter.page !== paginationData.currentPage) {
            paginationData.resultCount = $scope.projectList.resultCount;
            paginationData.currentPage = $scope.projectListFilter.page;

            if (paginationData.resultCount === 0) {
                paginationData.items = [];
            } else {
                var pages = [];
                pages.push(1);

                var pageCount = Math.ceil(paginationData.resultCount / 12.0);

                var mainGroupDistance = 2;

                var currentPage = parseInt(paginationData.currentPage);
                var mainGroupMin = Math.min(pageCount, Math.max(2, currentPage - mainGroupDistance));
                var mainGroupMax = Math.min(pageCount - 1, currentPage + mainGroupDistance);

                if (mainGroupMin > 2) {
                    pages.push(0);
                }

                for (var i = mainGroupMin; i <= mainGroupMax; i++) {
                    pages.push(i);
                }

                if (mainGroupMax < pageCount - 1) {
                    pages.push(0);
                }

                if (pageCount > 1) {
                    pages.push(pageCount);
                }

                paginationData.items = pages.map(function (page) {
                    if (page > 0) {
                        return {
                            page: page,
                            className: page === currentPage ? "active" : ""
                        };
                    } else {
                        return {label: "...", className: "disabled"};
                    }
                });
            }
        }

        return paginationData.items;
    };


});
