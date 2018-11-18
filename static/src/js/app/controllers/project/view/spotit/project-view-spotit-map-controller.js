angular.module('senseItWeb', null, null).controller('ProjectViewSpotItMapCtrl', function ($scope, $filter, $state) {

    $scope.sortableClass = function (column) {
        return column === $scope.sortedData.params.column ? ($scope.sortedData.params.ascending ? 'ascending' : 'descending') : '';
    };

    $scope.sort = function (column) {
        var ascending = column === $scope.sortedData.params.column ?
            !$scope.sortedData.params.ascending : false;

        $scope.sortedData.sort(column, ascending);
    };

    $scope.goto = {
        index: function (index, delta) {
            var testIndex = index;
            while(!$scope.sortedData.data[testIndex].geolocation) {
                testIndex = (testIndex + delta + $scope.sortedData.data.length) % $scope.sortedData.data.length;
                if (testIndex === index) {
                  break;
                }
            }

            $scope.mapData.selected = $scope.sortedData.data[testIndex].id;
        },
        first: function () {
            this.index(0, 1);
        },
        next: function () {
            if ($scope.mapData.selectedIndex >= 0) {
                this.index($scope.mapData.selectedIndex < $scope.sortedData.data.length - 1 ? $scope.mapData.selectedIndex + 1 : 0, 1);
            }
        },
        previous: function () {
            if ($scope.mapData.selectedIndex >= 0) {
                this.index($scope.mapData.selectedIndex > 0 ? $scope.mapData.selectedIndex - 1 : $scope.sortedData.data.length - 1, -1);
            }
        },
        last: function () {
            this.index($scope.sortedData.data.length - 1, -1);
        }
    };

    $scope.mapData = {
        selected: $state.params.item,
        selectedIndex: -1,
        textKey: $scope.dataInfo.tableVariables.length > 0 ? 0 : 'date',
        iconText: function (item) {
            var text = '';
            switch (this.textKey) {
                case 'date':
                    if (item.date) {
                        var format = 'd/M/yy';
                        var now = new Date();
                        var date = new Date(item.date);
                        if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) {
                            format = 'H:mm';
                        }
                        text = $filter('date')(item.date, format);
                    }
                    break;
                case 'author':
                    text = item.author.username;
                    break;
                case 'votes':
                    text = item.voteCount.positive + '/' + (-item.voteCount.negative);
                    break;
                default:
                    if (this.textKey in $scope.dataInfo.tableVariables) {
                        text = this.value(item, $scope.dataInfo.tableVariables[this.textKey]).toPrecision(5);
                    }
                    break;
            }

            return text.length > 10 ? text.substr(0, 10) : text;
        },
        infoWindow: function (item) {
            var content = '', i, v;
            var url = '/project/' + $scope.projectData.project.id + '/item/' + item.id;
            content += '<a href="#' + url + '">Title: ' + item.title + '</a><br/>';
            content += 'Author: ' + item.author.username + '<br/>';
            if (item.date) {
                content += 'On ' + $filter('fuzzyDate')(item.date) + '<br/>';
            }

            for (i = 0; i < $scope.dataInfo.tableVariables.length; i++) {
                v = $scope.dataInfo.tableVariables[i];
                content += v.label() + ": " + item.varValue[v.id].v[0] + '<br/>';
            }

            content += '<img style="padding-top: 0.5em" src="/files/thumb/' + item.observation + '" /><br/>';
            return content;
        },
        getItemHeat: function (item) {
            switch ($scope.sortedData.params.column) {
                case 'votes':
                    return item.voteCount.positive;
                case 'date':
                    return item.date || 0;
                case 'author':
                    return 1;
                default:
                    return $scope.sortedData.params.column in item.varValue ? item.varValue[$scope.sortedData.params.column].v[0] : 0;
            }
        },
        mapVariables: $scope.dataInfo.tableVariables.map(function (v) {
            return {id: v.id, label: v.label(), weight: v.weight};
        }),
        value: function (item, v) {
            var varValue = item.varValue[ v.id ];

            if (!item || !varValue) {
                return 0;
            }
            $scope.alert.debug("senseit-map-ctrl:", (varValue.v.length ? "ok": "bug?"), item, v);

            return varValue.v.length ? varValue.v[ 0 ] : 0;
        },
        location: function (item) {
            try {
                return JSON.parse(item.geolocation);
            } catch (e) {
                return null;
            }
        }
    };


    $scope.showOptions = [
        {label: 'Author', value: 'author'},
        {label: 'Date', value: 'date'},
        {label: 'Votes', value: 'votes'}
    ];

    for (var i = 0; i < $scope.mapData.mapVariables.length; i++) {
        var v = $scope.mapData.mapVariables[i];
        $scope.showOptions.push({label: v.label, value: i});
    }


});
