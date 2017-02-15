
angular.module('senseItServices', null, null)
    .factory('RestConfig', ['$http', 'senseItConfig', function ($httpProvider, senseItConfig) {
  'use strict';

  var url_template = senseItConfig.api_url_template || '{p}';

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;

  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  return {
    url: function (path) {
      return url_template.replace('{p}', path);
    }
  };
}])
    .factory('RestService', ['$http', 'RestConfig', function ($http, RestConfig) {
  'use strict';

  var service = {
    errorListeners: [],
    registerErrorListener: function (listener) {
      this.errorListeners.push(listener);
    },
    _promiserequest: function (promise) {
      return promise.then(function (response) {
        if (response.data) {
          return response.data;
        } else {
          for (var i = 0; i < service.errorListeners.length; i++) {
            service.errorListeners[i]();
          }
          return null;
        }
      });
    },
    request: function (method, path, data, files, convertToMultipart) {
      switch (method) {
        case 'get':
          return this.get(path, data);
        case 'post':
          return this.post(path, data, files, convertToMultipart);
        case 'put':
          return this.put(path, data, files);
        case 'delete':
          return this.delete(path);
        default:
          return null;
      }
    },
    get: function (path, data) {
      path = RestConfig.url(path);

      return service._promiserequest($http.get(path, {
        params: angular.extend({t: new Date().getTime()}, data)
      }));
    },
    _createUploadPromise: function (method, path, data, files, convertToMultipart) {
      var hasFiles = false, fileId;
      if (files) {
        for (fileId in files) {
          if (files.hasOwnProperty(fileId)) {
            hasFiles = true;
            break;
          }
        }
      }

      var promise;

      if (hasFiles) {
        var fd = new FormData();

        if (convertToMultipart) {
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              fd.append(key, data[key]);
            }
          }
        } else {
          fd.append("body", JSON.stringify(data));
        }

        for (fileId in files) {
          if (files.hasOwnProperty(fileId)) {
            fd.append(fileId, files[fileId]);
          }
        }

        promise = $http[method](path + '/files', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        });

      } else {
        promise = $http[method](path, data);
      }
      return service._promiserequest(promise);
    },
    /**
     *
     * @param path
     * @param data
     * @param [files=null]
     * @returns {*}
     */
    post: function (path, data, files, convertToMultipart) {
      path = RestConfig.url(path);

      return service._createUploadPromise('post', path, data, files, convertToMultipart || false);
    },
    /**
     *
     * @param path
     * @param data
     * @param [files=null]
     * @returns {*}
     */
    put: function (path, data, files) {
      path = RestConfig.url(path);

      return service._createUploadPromise('put', path, data, files);
    },
    delete: function (path) {
      path = RestConfig.url(path);

      return service._promiserequest($http.delete(path));
    },
    setToken: function (token) {
      $http.defaults.headers.common["nquire-it-token"] = token;
    }
  };

  return service;
}]);
