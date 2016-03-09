/*!
  Filter / tags service.

  Created by nfreear on 10/12/15.
*/

angular.module('senseItServices', null, null).factory('FilterTagService', ['RestService', '$rootScope', '$log', '$timeout',
  function (RestService, $rootScope, $log, $timeout) {

  'use strict';

  var tag_label_hide = ".HIDE.new"
    , label_hide_regex = /(DISABLE|HIDE|PRIVATE)/
    , valid_tag_regex = /^[a-z0-9\-]+$/   //Was: /^[a-z\-]+$/ or /^[\w\-]+$/
    , error_timeout = 3000
    , form_errors = {}
    , manager;

  var FilterTagManager = function () {
    this.data = {};
  };

  function testRestError() {
    RestService.get('api/test/ok');
    RestService.get('api/test/fail');
    //Was: RestService.get('api/test/fail/400');
  }

  FilterTagManager.prototype.pattern = function () {
    // ngPattern does not work in Angular ~1.2 :(.
    return valid_tag_regex;
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
        filters[ key ].active = item.label && ! item.label.match(label_hide_regex) && is_valid;

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
      , filter_r = project.filters && project.filters.split(/,/)
      , query_list = self.query_list
      , tags = {}
      , it, tag, label;

    if (! project.filters) {
      return;
    }

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
        if (setFilterCallback) { setFilterCallback(label, tag); }

        $log.info("Tags.setMissingTags: ", [ tag, label ]);
      }
    }
  };

  FilterTagManager.prototype.validTag = function (query, which) {
    var is_valid = query.trim().match(valid_tag_regex);
    if (! is_valid && '' === query) {
      setFormError("empty-tag", which);
    }
    else if (! is_valid) {
      setFormError("invalid-tag", which);
    }
    return is_valid;
  };

  FilterTagManager.prototype.catchDuplicateTag = function (resp, which) {
    var b_catch = resp.data && resp.data.message && resp.data.message.match(/javax.persistence.RollbackException/);
    if (b_catch) {
      setFormError("duplicate-tag", which);
    }
    return b_catch;
  };

  FilterTagManager.prototype.formError = function (which) {
    which = which || "default";
    return form_errors.which;
  };

  function setFormError(error, which) {
    which = which || "default";
    form_errors.which = error;

    $timeout(function () {
      form_errors.which = null;
    }, error_timeout);
  }


  return {
    get: function (scope, updateCallback) {
      var stopWatching = scope.$watch('tags.data', updateCallback);
      scope.tags = manager = new FilterTagManager();
      scope.$on('$destroy', stopWatching);
    }
  };
}]);
