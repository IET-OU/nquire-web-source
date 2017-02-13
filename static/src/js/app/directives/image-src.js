/*!
  An Angular directive to allow images to be hosted separately from the site itself.

  Nick Freear, 10 February 2017.

  http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
  (http://stackoverflow.com/questions/26506841/change-angular-directive-element-attribute-dynamically)
*/

angular.module('senseItWeb', null, null).directive('siwSrc', ['senseItConfig', function (senseItConfig) {
    'use strict';

    var url_template = senseItConfig.image_url_template || '{p}';

    //window.console.log('siwSrc', url_template);

    return {
      restrict: 'A',   // HTML attributes only!

      /*priority: 10000, // ??
      terminal: true,  // ??
      scope: {
        collection: '='  // ??
      },*/

      link: function (scope, element, attrs) {

        attrs.$observe('siwSrc', function (interpolated_src) {
          element.attr('src', url_template.replace('{p}', interpolated_src));
        });

        /*scope: .$watch(attrs.siwSrc, function (interpolated_src) {
          element.attr('src', interpolated_src);
        });*/

        //attrs.$set('src', attrs.$get('siwSrc'));
        //$compile(element)(scope);
      }
    };
}]);
