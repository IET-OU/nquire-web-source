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


    // Scratchpad/notepad on test site only.
    if ($scope.cfg.admin_texts_notepad) {
        $scope.itemList.push({ id: 'notepad', label: 'Notepad', format: true });
    }


    translateExtendItemList($scope);


    function translateExtendItemList($scope) {
      var it
        , item
        , lang
        , id
        , label
        , orig_label = ' <b>(original English)</b>'
        , $the_langs = $scope.cfg.langs
        , new_list = [];

      if (! $scope.activeLang) {
          return;
      }

      for (it in $scope.itemList) {
          item = $scope.itemList[ it ];

          for (lang in $the_langs) {

              if ("en" === lang) {
                  id = item.id;
                  label = item.label + orig_label;
              } else {
                  id = item.id + "_" + lang;
                  label = item.label + " <b>(" + $the_langs[ lang ] + ")</b>";
              }
              new_list.push({ id: id, label: label, format: item.format, lang: lang });
          }
      }
      $scope.itemList = new_list;

      $scope.log("i18n: itemList: ", $scope.itemList);
    }

});
