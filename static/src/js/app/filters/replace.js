/*!
  Angular filter to replace text.

  Created by Nick Freear, 16 March 2016.
*/

angular.module('senseItWeb', null, null).filter('replace', function () {
    'use strict';

    return function (input, pattern, newSubStr, flags) {
        var regex = pattern ? new RegExp(pattern, flags) : null;
	      //Was: console.log("Filter replace: ", input, pattern, regex, newSubStr, flags);
	      if (input && regex && typeof newSubStr === 'string') {
	          return input.replace(regex, newSubStr);
	      }
	      return input;
    };
});
