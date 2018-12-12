angular.module('senseItWeb', null, null).controller('ProjectViewSpotItCtrl', function ($scope) {
    $scope.templates.menu = 'partials/project/view/spotit/spotit-view-menu.html';
    $scope.templates.projectData = 'partials/project/view/spotit/spotit-project-data.html';
    $scope.templates.outlineData = 'partials/project/view/spotit/spotit-view-outline.html';
    $scope.templates.dataMap = 'partials/project/view/spotit/spotit-data-map.html';
    $scope.templates.projectDataCommentsDisabled = 'partials/project/view/spotit/spotit-posting-disabled.html';

    $scope.templates.dataTable = 'partials/project/view/spotit/data-table-spotit.html';
    $scope.templates.dataItem = 'partials/project/view/spotit/data-item-spotit.html';


    $scope.dataInfo = {
        type: 'spotit',
        tableVariables: []
    };

    $scope.hasGeolocation = function () {
        var data = $scope.$parent && $scope.$parent.dataList && $scope.$parent.dataList.items;
        return data && data.some(function (item) {
            return item.geolocation;
        });
    };

      $scope.mapData = {
          mapVariables: $scope.dataInfo.tableVariables.map(function(v) {
              return {id: v.id, label: v.label(), weight: v.weight};
          }),
          value: function(item, v) {
              return item.varValue[v.id].v[0];
          },
          location: function(item) {
              return JSON.parse(item.geolocation);
          }
      };

});
