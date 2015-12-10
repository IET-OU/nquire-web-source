/*!
  Filter / tags service.

  Created by nfreear on 10/12/15.
*/

'use strict';

angular.module('senseItServices', null, null).factory('FilterTagService', ['RestService', 'AdminService', '$log', function (RestService, AdminService, $log) {

  var tag_label_hide = ".HIDE.new"
    , label_hide_regex = /(DISABLE|HIDE|PRIVATE)/
    , valid_tag_regex = /^[\w\-]+$/
    , manager;

  var FilterTagManager = function () {
    this.data = {};
  };


  FilterTagManager.prototype.getList = function () {
    var self = this;

    RestService.get('api/filter').then(function (data) {
      // Enable editing via the admin UI.
      var it, item, key, is_valid
        , filters = {}
        , query_list = {};

      for (it in data) {
        item = data[ it ];
        key = "_idx_" + item.id;
        is_valid = item.query && item.query.match(valid_tag_regex);

        filters[ key ]= item;
        filters[ key ]._idx = key;
        filters[ key ].active = ! item.label.match(label_hide_regex) && is_valid;

        query_list[ item.query ] = item.label;

        if (! is_valid) {
          $log.warn("Error, invalid filter-tag (spaces?) ", item);
        }
      }
      self.data.filters = filters;
      self.query_list = query_list;

      $log.info("Tags.getList: ", filters, query_list);
    });
  };

  // http://stackoverflow.com/questions/30506300/how-do-i-trim-a-string-in-angularjs
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }

  FilterTagManager.prototype.projectTags = function (project) {
    var self = this
      , filter_r = project.filters.split(/,/)
      , query_list = self.query_list
      , tags = {}
      , it, tag, label;

    for (it in filter_r) {
      tag = filter_r[ it ].trim();

      if (tag in query_list) {
        label = query_list[ tag ];
        if (label && ! label.match(label_hide_regex)) {
          tags[ tag ] = label;
        }
      }
    }
    //project.tagList = tags;
    self.data.projectTags = Object.keys(tags).length ? tags : null;

    $log.info("Tags.projectTags: ", tags, filter_r, query_list);

    return self.data.projectTags;
  };


  FilterTagManager.prototype.setMissingTags = function (filters, setFilterCallback) {
    var self = this
      , filter_r = filters && filters.split(/,/)
      , query_list = self.query_list
      , it, tag, label;

    if (! filters) {
      return;
    }

    for (it in filter_r) {
      tag = filter_r[ it ].trim();

      if (! (tag in query_list) ) {
        // Looks like a new tag - hide it initially!
        label = tag.replace(/-/, ' ') + tag_label_hide;

        //TODO: "manager.getList" gives "TypeError: Cannot read property 'data' of undefined at filter-tag-service.js:43"
        //setFilterCallback && setFilterCallback(label, tag, null, manager.getList);
        setFilterCallback && setFilterCallback(label, tag);
        //AdminService.setFilter(label, tag);

        $log.info("Tags.setMissingTags: ", [ tag, label ]);
      }
    }
  };


  return {
    get: function (scope, updateCallback) {
      var stopWatching = scope.$watch('tags.data', updateCallback);
      scope.tags = manager = new FilterTagManager();
      scope.$on('$destroy', stopWatching);
    }
  };
}]);
