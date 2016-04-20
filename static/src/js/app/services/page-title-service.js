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
    , default_title = cfg.page_title_default || _('nQuire-it — join missions to explore your world')
    , title_template = cfg.page_title_template || _('%s — nQuire-it')  // [i18n]
    , selectors = [
        '.project-section-description-text-title'
      , '.project-section-content-header'
      , '.content-sidebar [ class *= "-header" ]:first span:first' // .about-header, .forum-header, .profile-header ;
    ]
    , $title = angular.element('title')
    ;

  $scope.$on('$locationChangeSuccess', function (ev, current) {
    $timeout(function () {
      onRouteChange(ev, current);
    }, 400);
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
