angular.module('senseItWeb', null, null).controller('ProfileCtrl', function ($scope, OpenIdService, $state, fileReader) {
  'use strict';

	var _ = $scope._
	  , password_min = 6;


	$scope.noyes = [
		{value: '0', label: 'no'},
		{value: '1', label: 'yes'}
	];

  if (!$scope.status.logged && $state.params.goBack) {
    OpenIdService.registerWatcher($scope, function () {
      if ($scope.status.logged) {
        $state.go($state.previous);
      }
    });
  }

  $scope.form = new SiwFormManager(function () {
      if ($scope.status.profile.metadata === null) {
        $scope.status.profile.metadata = {};
      }
      if ($scope.status.profile.visibility === null) {
        $scope.status.profile.visibility = {};
      }
      return $scope.status.profile;
    }, ['username', 'email', 'notify1', 'notify2', 'notify3', 'notify4', 'notify5', 'metadata', 'visibility'], function () {
      $scope.status.newUser = false;
      $scope.openIdService.saveProfile().then(function (data) {
        $scope.formError = data.responses.username || null;
        if ($scope.formError) {
          $scope.form.open('username');
        }
      });
    }, function () {
      $scope.formError = null;
    }
  );

  $scope.visibilityDisplay = function () {
    var options = [
      ['metadata', 'Profile information'],
      ['projectsJoined', 'Joined projects'],
      ['projectsCreated', 'Projects created by me']
    ].filter(function (option) {
        return $scope.status.profile.visibility &&
          $scope.status.profile.visibility[option[0]];
      });

    if (options.length > 0) {
      return options.map(function (option) {
        return '<b>' + option[1] + '</b>';
      }).join(', ');
    } else {
      return 'none';
    }
  };

  $scope.imageForm = new SiwFormManager(function () {
    return $scope.status.profile;
  }, [], function () {
    $scope.openIdService.saveProfileImage($scope.imageForm.files);
  });

  $scope.filelistener = {
    previewFile: null,
    set: function (key, file) {
      $scope.imageForm.setFile(key, file);
      this.updatePreview();
    },
    clear: function (key) {
      $scope.imageForm.clearFile(key);
      this.updatePreview();
    },
    deleteFile: function (key) {
      $scope.imageForm.deleteFile(key);
      this.updatePreview();
    },
    updatePreview: function () {
      if ($scope.imageForm.files['image']) {
        fileReader.readAsDataUrl($scope.imageForm.files['image'], $scope).then(function (result) {
          $scope.filelistener.previewFile = result;
        });
      } else {
        $scope.filelistener.previewFile = null;
      }
    }
  };

  $scope.filelistener.updatePreview();

  $scope.logout = function () {
    $scope.openIdService.logout();
  };

  $scope.providerLogin = function (provider, action) {
    OpenIdService.providerLogin(provider, action);
  };

  $scope.deleteConnection = function (providerId) {
    $scope.openIdService.deleteConnection(providerId);
  };

  $scope.formError = null;

  $scope.formErrorText = function () {
    switch ($scope.formError) {
      case 'username_empty':
        return 'Username cannot be empty';
      case 'username_not_available':
        return 'Username not available (already taken)';
      default:
        return '';
    }
  };

  $scope.loginMode = {
    mode: 'login',
    set: function (mode) {
      this.mode = mode;
    },
    is: function (mode) {
      return this.mode === mode;
    }
  };


  $scope.login = {
    editing: {username: '', password: ''},
    error: {
      username: false,
      password: false
    },
    clearPassword: function () {
      var p = this.editing.password;
      this.editing.password = "";
      return p;
    },
    submit: function () {
      var ok = true;

      this.editing.username = this.editing.username.trim();

      if (this.editing.username.length === 0) {
        this.error.username = _('Username cannot be empty.');
        ok = false;
      }
      if (this.editing.password.length === 0) {
        this.error.password = _('Password cannot be empty.');
        ok = false;
      }

      if (ok) {
        var error = this.error;
        error.username = null;
        OpenIdService.login(this.editing.username, this.clearPassword(), function (data) {
          error.password = data === 'false' ? _('Username & password do not match.') : null;
        });
      }
    }
  };

  $scope.register = {
    recaptcha: {siteKey: $scope.cfg.recaptcha.siteKey},
    editing: {username: '', password: '', repeatPassword: '', email: ''},
    error: {username: false, password: false, repeatPassword: false, email: false, recaptcha: false},
    clearPassword: function () {
      var p = this.editing.password;
      this.editing.password = this.editing.repeatPassword = "";
      return p;
    },
    reset: function () {
      this.editing = {username: '', password: '', repeatPassword: '', email: ''};
      this.error = {username: false, password: false, repeatPassword: false, email: false, recaptcha: false};
    },
    submit: function () {
      var ok = true;

      this.editing.username = this.editing.username.trim();
      this.editing.email = this.editing.email.trim();
      this.editing.recaptcha = angular.element("#g-recaptcha-response").val();
      this.error = {username: false, password: false, repeatPassword: false, email: false, recaptcha: false};

      if (this.editing.username.length === 0) {
        this.error.username = _('Username cannot be empty.');
        ok = false;
      }
      if (this.editing.email.length === 0) {
        this.error.email = _('Email cannot be empty.');
        ok = false;
      }

      if (this.editing.password.length < password_min) {
        this.error.password = _('Password must have at least {{n}} characters.', { 'n': password_min });
        ok = false;
      }

      if (this.editing.password !== this.editing.repeatPassword) {
        this.error.repeatPassword = _('Passwords do not match.');
        ok = false;
      }

      if (this.editing.recaptcha === '') {
        this.error.recaptcha = _('Are you a human being or a robot?');
        ok = false;
      }

      if (ok) {
        var error = this.error = {username: false, password: false, repeatPassword: false, email: false};
        OpenIdService.register(this.editing.username, this.clearPassword(), this.editing.email, this.editing.recaptcha).then(function (data) {
          switch (data.responses.registration) {
            case 'username_exists':
              error.username = _('Username not available.');
              break;
            case 'email_exists':
              error.email = _('Email already associated with a different account.');
              break;
            case 'bad_recaptcha':
              error.recaptcha = _('Captcha failed. Try again.');
              grecaptcha.reset();
              break;
          }
        });
      }
    }
  };


  $scope.reminder = {
    recaptcha: {siteKey: $scope.cfg.recaptcha.siteKey},
    editing: {email: ''},
    error: {email: false},
    reset: function () {
      this.editing = {email: ''};
      this.error = {email: false};
    },
    submit: function () {
      var ok = true;

      this.editing.email = this.editing.email.trim();
      this.editing.recaptcha = angular.element("#g-recaptcha-response").val();

      if (this.editing.email.length === 0) {
        this.error.email = _('Email cannot be empty.');
        ok = false;
      }

      if (this.editing.recaptcha === '') {
        this.error.recaptcha = _('Are you a human being or a robot?');
        ok = false;
      }

      if (ok) {
        var error = this.error = {email: false};
        OpenIdService.reminder(this.editing.email, this.editing.recaptcha).then(function (data) {
	        grecaptcha.reset();
          switch (data.responses.reminder) {
            case 'email_not_exists':
              error.email = _('No account found with that email or username.');
              break;
            case 'bad_recaptcha':
              error.recaptcha = _('Captcha failed. Try again.');
              break;
            case 'reminder_sent':
              error.email = _('A password reminder has been sent.');
              break;
          }
        });
      }
    }
  };

  $scope.password = {
    set: function () {
      return $scope.status.profile.passwordSet;
    },
    editing: false,
    error: {
      oldPassword: false,
      newPassword: false,
      repeatPassword: false
    },
    edit: function () {
      this.editing = {oldPassword: '', newPassword: '', repeatPassword: ''};
    },
    close: function () {
      this.editing = false;
    },
    cancel: function () {
      this.close();
    },
    save: function () {

      var ok = true;
      if (this.editing.newPassword.length < password_min) {
        this.error.password = _('Password must have at least {{n}} characters.', { 'n': password_min });
        ok = false;
      }

      if (this.editing.newPassword !== this.editing.repeatPassword) {
        this.error.repeatPassword = _('Passwords do not match.');
        ok = false;
      }

      if (ok) {
        var self = this;
        var error = self.error;

        error.repeatPassword = false;
        OpenIdService.setPassword(this.editing.oldPassword, this.editing.newPassword).then(function (data) {
          switch (data.responses.oldpassword) {
            case 'bad_password':
              error.oldPassword = 'Old password is not valid.';
              break;
            default:
              error.oldPassword = false;
              break;
          }

          switch (data.responses.newpassword) {
            case 'too_short':
              error.newPassword = 'New password is too short.';
              break;
            case 'same_as_username':
              error.newPassword = 'New password cannot be equal to your username.';
              break;
            default:
              error.newPassword = false;
              break;
          }

          if (!error.repeatPassword && !error.newPassword && !error.oldPassword) {
            self.close();
          }
        });
      }
    }
  };

});
