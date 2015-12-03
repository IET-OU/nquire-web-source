angular.module('senseItWeb', null, null).controller('AdminTextsCtrl', function ($scope) {

    $scope.itemList = [
        {id: 'headerSubtitle', label: 'Header subtitle', format: false},
        {id: 'nquireVideo', label: 'Project list video', format: false},
        {id: 'nquireTeaser', label: 'Project list teaser', format: true},
        {id: 'about', label: 'About', format: true},
        {id: 'createSenseIt', label: 'Create: Sense It intro', format: true},
        {id: 'createSenseItHelp', label: 'Create: Sense It help', format: true},
        {id: 'createSpotIt', label: 'Create: Spot It intro', format: true},
        {id: 'createSpotItHelp', label: 'Create: Spot It help', format: true},
        {id: 'createWinIt', label: 'Create: Win It intro', format: true},
        {id: 'createWinItHelp', label: 'Create: Win It help', format: true},

        // Site/ approval/ test server message [Bug: #9]
        {id: 'siteMessage', label: 'Site message', format: true},
        //Was: {id: 'siteMessageTpl', label: '(Site message template)', format: true}
    ];


    translateExtendItemList($scope);


    function translateExtendItemList($scope) {
      var idx = 0
        , item
        , lang
        , id
        , label
        , length = $scope.itemList.length;

      if (! $scope.activeLang) {
          return;
      }

      for (idx = 0; idx < length; idx++) {
          item = $scope.itemList[ idx ];
          ///
          for (lang in $scope.langs) {
              if ("en" === lang) continue;

              id = item.id + "_" + lang;
              label = item.label + " (" + $scope.langs[ lang ] + ")";

              $scope.itemList.push({ id: id, label: label, format: item.format, lang: lang });
          }
      }
    }

    $scope.log("i18n: itemList: ", $scope.itemList);
});
