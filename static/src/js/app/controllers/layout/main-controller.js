angular.module('senseItWeb', null, null).controller('MainCtrl', function ($scope, OpenIdService, RestService, gettextCatalog, FilterTagService, $location, $timeout, $log) {
    OpenIdService.registerWatcher($scope);

    initDebug($scope, $location, $log);
    initApprovalServer($scope, $location);

    initTranslation($scope, $location, gettextCatalog);

    FilterTagService.get($scope);
    $scope.tags.getList();

    $("html").attr({
      "data-debug": $scope.debug,
      "data-approval": $scope.approval,
      "data-lang_switch": $scope.cfg.lang_switch,
      "data-lang_ui": $scope.activeLang
    });

    RestService.get('api/text').then(function(data) {
        var it;
        for (it in data) {
          if (data[ it ].length < 1) {
            data[ it ] = false;
          }
        }

        $scope.txt = data;

        // Site/ approval/ test server message [Bug: #5][Bug: #9]
        if ($scope.txt.siteMessage) {
          $("html").attr("data-site-message", 1);
        }

        translateSwitchApiTexts($scope, $location);
    });

    // I18n / translation [Bug: #3]
    function initTranslation($scope, $location, gettextCatalog) {
        //http://nquire/el#/home?kw=climate&debug=1
        //Was: location.pathname.match(/^(\/approval)?\/(el|en)/)
        var m_lang = $location.absUrl().match($scope.cfg.lang_url_regex);

        $scope.activeLang = m_lang ? m_lang[ 2 ] : 'en';

        if (m_lang) {
            gettextCatalog.setCurrentLanguage($scope.activeLang);
        }

        // navigator.languages?
        $scope.log("Lang:", $scope.cfg, m_lang, $location.absUrl(), angular.version);
    }


    // Translate help/about pages [Bug: #6]
    function translateSwitchApiTexts($scope, $location) {
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
                $scope.txt[ m_result[ 1 ] ] = texts[ it ];
            }
        }

        $scope.log("i18n: texts:", lang_regex, $scope.txt);
    }


    // Approval/ test server [Bug: #5]
    function initApprovalServer($scope, $location) {
        var m_approval = $location.absUrl().match(/\/(approval|localhost|nquire\/|pegasos\.)/);

        $scope.approval = m_approval && 1;
    }


    function initDebug($scope, $location, $log) {
        // Was: location.href.match(/[\?&\/]debug=1/);
        var m_debug = $location.absUrl().match(/[\?&\/]debug=(\d)/);

        $scope.debug = m_debug && m_debug[ 1 ];
        $scope.log = $scope.debug ? $log.info : function () {};
    }

});
