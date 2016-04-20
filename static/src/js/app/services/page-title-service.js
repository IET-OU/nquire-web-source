/*!
  Page title service / Angular.JS (~1.2)

  Part of nQuire-it | GPL | © The Open University (IET).
  Created by nfreear, 20 April 2016.

  http://stackoverflow.com/questions/14765719/how-to-watch-for-a-route-change-in-angularjs
*/

angular.module('senseItServices', null, null).factory('PageTitleService', ['$rootScope', '$timeout', 'AlertService',
  function ($scope, $timeout, alert) {

  'use strict';

  // https://docs.angularjs.org/error/$injector/unpr?p0=PageTiteServiceProvider%20%3C-%20PageTiteService

  var cfg = $scope.cfg
    , default_title = cfg.page_title_default || 'nQuire-it — join missions to explore your world'
    , title_template = cfg.page_title_template || '%s — nQuire-it'  //[i18n] ?
    , timeout = cfg.page_title_timeout || 200
    , selectors = [
        '.page-title-service'
      , '.project-section-description-text-title'
      , '.project-section-content-header'
      , '.forum-header'
      , '.content-sidebar [ class *= "-header" ]:first span:first' // .about-header, .profile-header ..;
      , '.admin-header .active'
    ]
    , $title = angular.element('title')
    ;

  $scope.$on('$locationChangeSuccess', function (ev, current) {
    $timeout(function () {
      onRouteChange(ev, current);
    }, timeout);
  });


  function onRouteChange(ev, current) {
    var title_changed = false
      , it
      , elem;

     alert.debug('Route change ok:', ev, current, cfg);

     for (it in selectors) {
       elem = angular.element(selectors[ it ]);
       if (elem.length && elem.text()) {
         $title.text(title_template.replace('%s', elem.text()));
         title_changed = ! title_changed;
         alert.debug('Page title ok:', elem);
         break;
       }
     }
     if (! title_changed) {
       $title.text(default_title);
       alert.debug('Page title default');
     }
  }

  alert.debug('Page title service');
}]);
