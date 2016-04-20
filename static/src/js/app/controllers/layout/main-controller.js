/*!
  Main controller.

  Part of nQuire-it | GPL | © The Open University (IET).
*/

angular.module('senseItWeb', null, null).controller('MainCtrl', function ($scope, OpenIdService, RestService, gettextCatalog, FilterTagService, AlertService, PageTitleService, $location) {
    'use strict';

    OpenIdService.registerWatcher($scope);

    $scope.alert = AlertService;
    $scope.pageTitle = PageTitleService;

    initDebug($scope, $location);

    initTranslation($scope, $location, gettextCatalog);

    var _ = $scope._
      , trans_test = _('Email cannot be empty.');

    FilterTagService.get($scope);
    $scope.tags.getList();

    angular.element("html").attr({
      "data-debug": $scope.alert.isDebug(),
      "data-approval": $scope.alert.isApproval(),
      "data-lang_switch": $scope.cfg.lang_switch,
      "data-lang_ui": $scope.activeLang
    });  //Was: $window.$()..


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
          angular.element("html").attr("data-site-message", 1);
        }

        translateSwitchApiTexts($scope, $location);
    });

    // I18n / translation [Bug: #3]
    function initTranslation($scope, $location, gettextCatalog) {
        //http://nquire/el#/home?kw=climate&debug=1
        //Was: location.pathname.match(/^(\/approval)?\/(el|en)/)
        var m_lang = $location.absUrl().match($scope.cfg.lang_url_regex);

        $scope.activeLang = m_lang ? m_lang[ 2 ] : 'en';
        $scope.gettext = gettextCatalog;
        $scope._ = function (str, scope, ctx) {
            return gettextCatalog.getString(str, scope, ctx);
        };

        if (m_lang) {
            $scope.gettext.setCurrentLanguage($scope.activeLang);
        }

        // navigator.languages?
        $scope.alert.debug("Lang:", $scope.cfg, m_lang, $location.absUrl(), angular.version);
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

        $scope.alert.debug("i18n: texts:", lang_regex, $scope.txt);
    }

    function initDebug($scope, $location) {
        // Was: location.href.match(/[\?&\/]debug=1/);
        var m_debug = $location.absUrl().match(/[\?&\/]debug=(\d)/);

        $scope.log = $scope.alert.debug;
    }

});
