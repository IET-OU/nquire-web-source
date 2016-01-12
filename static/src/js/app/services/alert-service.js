/*!
  Alert / 'flash' user-message service / Angular.JS (~1.2)

  Created by nfreear on 16/12/2015.

  http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/displaying-a-flash-notice-failure-message.html
*/

'use strict';

angular.module('senseItServices', null, null).factory('AlertService', ['$rootScope', '$location', '$log', '$interval', '$timeout',
  function ($rootScope, $location, $log, $interval, $timeout) {

  var cfg = $rootScope.cfg
    , timeout_ms = cfg && cfg.alert_timeout || 4000
    , in_banner  = cfg && cfg.alert_banner  || true
    , is_debug = $location.absUrl().match(/[\?&\/]debug=(\d)/)
    , is_approval = $location.absUrl().match(/\/(approval|localhost|nquire\/|pegasos\.)/)
    , _debug = is_debug ? $log.warn : function () {}
    , queue = []
    , currentMessage = null
    , currentType = null
    , promise_int
    , promise_tm;

  _debug("Config: ", timeout_ms, in_banner, is_debug);

  promise_int = $interval(function () {

    currentMessage = queue.shift() || false;
    angular.element("html").attr("data-alert", currentMessage ? 1 : 0);  //Was: $window.$()..

  }, timeout_ms);


  function _message(text, type) {
    queue.push(text);
    currentType = type || "info";

    promise_tm = $timeout(function () {
      currentMessage = queue.shift() || false;
      angular.element("html").attr("data-alert", currentMessage ? 1 : 0);
    }, 0);
  }


  return {
    getText: function () {
      return currentMessage;
    },
    ngClass: function () {
      return "alert alert-" + currentType;
    },
    error: function (text, extra) {
      _message(text, "danger error");
      $log.error("Error (alert).", text, extra);
    },
    warn: function (text, extra) {
      _message(text, "warning");
      $log.warn("Warning (alert).", text, extra);
    },
    info: function (text, extra) {
      _message(text, "info");
      $log.info("Info (alert).", text, extra);
    },
    success: function (text, extra) {
      _message(text, "success ok");
      $log.info("Success (alert).", text, extra);
    },
    // Approval/ test server [Bug: #5]
    isApproval: function () {
      return is_approval && 1;
    },
    isDebug: function () {
      return is_debug && 1;
    },
    message: _message,
    debug: _debug
  };
}]);
