
angular.module('senseItServices', null, null).factory('OpenIdService', ['RestService', '$state', '$location', '$window', function (RestService, $state, $location, $window) {
  'use strict';

  var service = {
    status: {
      ready: false
    },
    listeners: []
  };

  service.registerListener = function (listener) {
    service.listeners.push(listener);
  };

  service.removeListener = function (listener) {
    var index = service.listeners.indexOf(listener);
    if (index >= 0) {
      service.listeners.splice(index, 1);
    }
  };


  service._fireLoginEvent = function (logged) {
    for (var i = 0; i < service.listeners.length; i++) {
      service.listeners[i](logged);
    }
  };

  service._openIdRequest = function (path, logged, notify, method, data, files) {
    var _method = method ? method : 'get';
    var promise = (data || files) ? RestService[_method](path, data, files) : RestService[_method](path);
    return promise.then(function (data) {
      service.status = {
        logged: data.logged,
        profile: data.profile,
        connections: data.connections,
        ready: true
      };

      if (data && data.token) {
        RestService.setToken(data.token);
      }

      if (notify) {
        service._fireLoginEvent(logged);
      }

      return data;
    });
  };


  service._update = function (redirect) {
    return service._openIdRequest('api/security/status', true, true).then(function () {
      if (service.status.logged) {
        if (redirect && service.destination) {
          $location.path(service.destination);
        }
        service.destination = null;
      }
    });
  };

  service.login = function (username, password, callback) {
    return RestService.post('api/security/login', {
      username: username,
      password: password
    }).then(function (data) {
      service._update(true);
      return callback(data);
    });
  };

  service.register = function (username, password, email, recaptcha, callback) {
    return service._openIdRequest('api/security/register', true, true, 'post', {
      username: username,
      password: password,
      email: email,
      recaptcha: recaptcha
    }).then(function (data) {
      service._update(false);
      return data;
    });
  };

  service.reminder = function (email, recaptcha, callback) {
    return service._openIdRequest('api/security/reminder', true, true, 'post', {
      email: email,
      recaptcha: recaptcha
    }).then(function (data) {
      service._update(false);
      return data;
    });
  };

  service.logout = function () {
    return service._openIdRequest('api/security/logout', false, true, 'post');
  };

  service.deleteConnection = function (providerId) {
    return service._openIdRequest('api/security/connection/' + providerId, true, true, 'delete');
  };

  service.saveProfile = function () {
    return service._openIdRequest('api/security/profile', true, false, 'put', {
      username: service.status.profile.username,
      email: service.status.profile.email,
      notify1: service.status.profile.notify1,
      notify2: service.status.profile.notify2,
      notify3: service.status.profile.notify3,
      notify4: service.status.profile.notify4,
      notify5: service.status.profile.notify5,
      metadata: service.status.profile.metadata,
      visibility: service.status.profile.visibility
    });
  };

  service.saveProfileImage = function (files) {
    return service._openIdRequest('api/security/profile/image', true, false, 'post', {}, files);
  };


  service.setPassword = function (oldPassword, newPassword) {
    return service._openIdRequest('api/security/password', true, false, 'put', {
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  };

  /**
   *
   * @param scope
   * @param [callback=null]
   */
  service.registerWatcher = function (scope, callback) {
    scope.openIdService = this;
    scope.status = scope.openIdService.status;

    var listener = scope.$watch('openIdService.status', function () {
      scope.status = scope.openIdService.status;
      if (callback) {
        callback();
      }
    }, true);

    scope.$on('$destroy', function () {
      listener();
    });
  };


  service._update(false);

  RestService.registerErrorListener(function () {
    return service._openIdRequest('api/security/status', true, false);
  });

  service.loginAndComeBack = function () {
    if (!service.status.logged) {
      service.destination = $location.path();
      $state.go('profile');
    }
  };

  service.providerLogin = function (provider, action) {
    var href = 'social/' + provider + '/' + action;
    if (service.destination) {
      href += '?d=' + encodeURIComponent(service.destination);
    }
    $window.location.href = href;
  };


  return service;
}]);
