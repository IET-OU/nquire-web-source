angular.module('senseItWeb', null, null).controller('AdminFiltersCtrl', function ($scope, $window, ModalService) {
    'use strict';

    $scope.submit = function () {
        //var promise = $scope.tags.adminAddFilter($scope.new_filter);
        var query = $scope.new_filter.query;
        if ($scope.tags.validTag(query, "add")) {
            var promise = $scope.admin.setFilter($scope.new_filter.label, query).then(function () {
                // Refresh, messages, ...
                $scope.tags.getList();
                $scope.alert.success("Tag successfully added: " + query);
                // ..And, clear!
                $scope.new_filter = {};
            })
            .catch(function (resp) {
                if ($scope.tags.catchDuplicateTag(resp, "add")) {
                    $scope.alert.error("Sorry! I can't add a duplicate tag: " + query, resp);
                } else {
                    $scope.alert.error("Sorry! Unknown error: " + query, resp);
                }
            });
        } else {
            $scope.alert.error("Invalid tag-term – empty or with spaces? " + query);
        }
    };




    if ($scope.item) {
        // ng-repeat context.
        $scope.deleteFilter = function (id, query) {
            var $button = angular.element("[ ng-click *= deleteFilter ]:first");  //Was: $window.$()..

            /*if (! $window.confirm(confirm_text)) {
                $scope.alert.debug("Cancel delete filter.");
                return false;
            }*/

            ModalService.open({
                title: $button.data("confirm_title"),
                body: "<p>" + $button.data("confirm").replace("%s", query) + "</p>",
                ok: function () {

            $scope.admin.deleteFilter(id).then(function () {
                $scope.tags.getList();
                $scope.alert.success("Tag successfully deleted: " + query);
            })
            .catch(function (resp) {
                $scope.alert.error("Sorry! Unknown error: " + query, resp);
            });
                    return true;
                }
            });
        };

        //Was: $scope.tags.data.filters ( $scope.itom )
        $scope.form = new SiwFormManager($scope.item, [ 'label', 'query', '_idx', 'id' ], function saveCallback() {
            var idx = $scope.item._idx
              , filters = $scope.tags.data.filters
              , item = $scope.item;

            if ($scope.tags.validTag(item.query, "edit")) {
                $scope.admin.setFilter(item.label, item.query, item.id).then(function () {
                    $scope.alert.success("Tag updated: " + item.query);

                    if ($scope.cfg.admin_refresh_lists) {
                        $scope.tags.getList();
                    }
                })
                .catch(function (resp) {
                    if ($scope.tags.catchDuplicateTag(resp, "edit")) {
                        $scope.alert.error("Sorry! I can't add a duplicate tag: " + item.query);
                    } else {
                        $scope.alert.error("Sorry! Unknown error: " + item.query, resp);
                    }
                });
            } else {
                $scope.alert.error("Invalid tag-term – empty or with spaces? " + query);
            }
        });

        $scope.alert.debug("$scope.form (f):", $scope.form, $scope.item);
    }


    $scope.alert.debug('AdminFiltersCtrl');
});
