angular.module('senseItWeb').directive('siwSidebarToggle', function ($window) {
    return {
        link: function (scope, element, attrs) {
            var label = attrs.siwSidebarLabel
              , sidebar = angular.element(element)  //$window.$(element)
              , button = angular.element('<div></div>').addClass('sidebar-toggle').attr({
                role: 'button',
                tabindex: 0,
                'aria-label': label
            });
            button.append('<i class="fa fa-angle-right"></i>');
            button.append('<i class="fa fa-angle-left"></i>');
            sidebar.append(button);

            button.click(function() {
                sidebar.toggleClass('sidebar-open');
            });
        }
    };
});
