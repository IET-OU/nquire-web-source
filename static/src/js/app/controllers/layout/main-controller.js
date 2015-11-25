angular.module('senseItWeb', null, null).controller('MainCtrl', function ($scope, OpenIdService, RestService, $log, $location) {
    OpenIdService.registerWatcher($scope);

    RestService.get('api/text').then(function(data) {

        $scope.txt = data;

        translateSwitchApiTexts();
    });


    // Translate help/about pages [Bug: #6]
    function translateSwitchApiTexts() {
        var it
          , lang_regex
          , m_result
          , texts = $scope.txt
          , is_admin_page = $location.path().match(/\/admin\//);

        //$scope.txt_i18n = $scope.txt;

        if (! $scope.activeLang || "en" === $scope.activeLang || is_admin_page) {
            return;
        }

        lang_regex = new RegExp("^(\\w+)_" + $scope.activeLang + "$");

        for (it in texts) {
            m_result = it.match(lang_regex);
            if (m_result) {
                texts[ m_result[ 1 ] ] = texts[ it ];
            }
        }

        $log.debug("i18n: texts:", lang_regex, $scope.txt);
    }
});
