'use strict';

/* App Module */

angular.module('senseItWeb', ['ngSanitize', 'ui.router', 'textAngular', 'ui.bootstrap', 'senseItServices', 'gettext'], null).config([
  '$provide',
  '$stateProvider',
  '$urlRouterProvider',
  function ($provide, $stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home?type&filter&status&kw&debug',
        templateUrl: 'partials/projects/projects.html',
        controller: 'ProjectListCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'partials/layout/about.html'
      })
      .state('create', {
        url: '/create',
        templateUrl: 'partials/projects/create.html',
        controller: 'CreateCtrl'
      })
      .state('admin', {
        url: '/admin',
        abstract: true,
        templateUrl: 'partials/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .state('admin.users', {
        url: '',
        templateUrl: 'partials/admin/admin-users.html',
        controller: 'AdminUsersCtrl'
      })
      .state('admin.projects', {
        url: '/projects',
        templateUrl: 'partials/admin/admin-projects.html',
        controller: 'AdminProjectsCtrl'
      })
      .state('admin.texts', {
        url: '/texts',
        templateUrl: 'partials/admin/admin-texts.html',
        controller: 'AdminTextsCtrl'
      })
      .state('admin.reported', {
        url: '/reported',
        templateUrl: 'partials/admin/admin-reported.html',
        controller: 'AdminReportedCtrl'
      })
      .state('forum', {
        url: '/forum',
        abstract: true,
        templateUrl: 'partials/forum/forum.html',
        controller: 'ForumCtrl'
      })
      .state('forum.list', {
        url: '',
        templateUrl: 'partials/forum/forum-list.html',
        controller: 'ForumListCtrl'
      })
      .state('forum.node', {
        url: '/{forumId}',
        templateUrl: 'partials/forum/forum-node.html',
        controller: 'ForumNodeCtrl',
        abstract: true
      })
      .state('forum.node.list', {
        url: '',
        templateUrl: 'partials/forum/forum-node-list.html'
      })
      .state('forum.node.new-thread', {
        url: '/new',
        templateUrl: 'partials/forum/forum-node-new-thread.html',
        controller: 'ForumNodeNewThreadCtrl'
      })
      .state('forum.thread', {
        url: '/thread/{threadId}',
        templateUrl: 'partials/forum/forum-thread.html',
        controller: 'ForumThreadCtrl'
      })
      .state('project', {
        abstract: true,
        url: '/project/{projectId}',
        templateUrl: 'partials/project/project.html',
        controller: 'ProjectCtrl'
      })
      .state('project.view', {
        abstract: true,
        url: '',
        templateUrl: 'partials/project/view/project-view.html',
        controller: 'ProjectViewCtrl'
      })
      .state('project.view.home', {
        url: '',
        templateUrl: 'partials/project/view/home/project-view-home-page.html'
      })
      .state('project.view.details', {
        url: '/details',
        templateUrl: 'partials/project/view/home/project-view-details-page.html'
      })
      .state('project.view.comments', {
        url: '/comments',
        templateUrl: 'partials/project/view/project-view-comments.html'
      })
      .state('project.view.data-list', {
        url: '/data?item',
        templateUrl: 'partials/project/view/data/project-view-data-table.html'
      })
      .state('project.view.data-map', {
        url: '/map?item',
        templateUrl: 'partials/project/view/data/project-view-data-map.html',
        controller: 'ProjectViewDataMapCtrl'
      }).state('project.view.data-item', {
        url: '/item/{itemId}',
        templateUrl: 'partials/project/view/data/project-view-data-item.html',
        controller: 'ProjectViewDataItemCtrl'
      })
      .state('project.view.spotit-upload', {
        url: '/upload',
        templateUrl: 'partials/project/view/spotit/project-view-spotit-upload.html',
        controller: 'ProjectViewSpotItUploadCtrl'
      })
      .state('project.view.challenge', {
        url: '/challenge',
        templateUrl: 'partials/project/view/challenge/project-view-challenge-page.html'
      })
      .state('project.admin', {
        abstract: true,
        url: '/admin',
        templateUrl: 'partials/project/admin/project-admin.html',
        controller: 'ProjectAdminCtrl'
      })
      .state('project.admin.home', {
        url: '',
        templateUrl: 'partials/project/admin/project-admin-home-page.html'
      })
      .state('project.admin.challenge-main', {
        url: '/challenge',
        templateUrl: 'partials/project/admin/challenge/project-admin-challenge-page.html'
      })
      .state('project.admin.challenge-answers', {
        url: '/ideas',
        templateUrl: 'partials/project/admin/challenge/project-admin-challenge-answers-page.html'
      })
      .state('project.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'partials/project/edit/project-edit.html',
        controller: 'ProjectEditCtrl'
      })
      .state('project.edit.home', {
        url: '',
        templateUrl: 'partials/project/edit/project-edit-outline-page.html',
        controller: 'ProjectEditDescriptionCtrl'
      })
      .state('project.edit.details', {
        url: '/details',
        templateUrl: 'partials/project/edit/project-edit-details-page.html',
        controller: 'ProjectEditDescriptionCtrl'
      })
      .state('project.edit.senseit', {
        url: '/senseit',
        templateUrl: 'partials/project/edit/senseit/project-edit-senseit-page.html'
      })
      .state('project.edit.challenge', {
        url: '/challenge',
        templateUrl: 'partials/project/edit/challenge/project-edit-challenge-page.html'
      })
      .state('profile', {
        url: '/profile?goBack',
        templateUrl: 'partials/profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('profile-view', {
        url: '/profile/{uid}',
        templateUrl: 'partials/profile/profile-view.html',
        controller: 'ProfileViewCtrl'
      })
      .state('users', {
        url: '/users',
        templateUrl: 'partials/profile/profiles-loggedin.html',
        controller: 'ProfileLoggedInCtrl'
      });
    $urlRouterProvider.otherwise('/home');


    $provide.decorator('taOptions', ['$delegate', function (taOptions) {
      // $delegate is the taOptions we are decorating
      // here we override the default toolbars and classes specified in taOptions.
      taOptions.toolbar = [
        ['h1', 'h2', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight'],
        ['html', 'insertImage', 'insertLink']
      ];
      taOptions.classes = {
        focussed: 'focussed',
        toolbar: 'btn-toolbar',
        toolbarGroup: 'btn-group',
        toolbarButton: 'btn btn-default',
        toolbarButtonActive: 'active',
        disabled: 'disabled',
        textEditor: 'form-control',
        htmlEditor: 'form-control'
      };
      return taOptions; // whatever you return will be the taOptions
    }]);

  }
]).run(function (TrackingService) {
  TrackingService.registerGA();
}).run(function (gettextCatalog) {
  // I18n / translation [Bug: #3]
  var W = window
    , L = W.location
    , N = W.navigator
    //Was:, m_lang = L.match(/[\?&]lang=(el)/)
    //http://nquire/el#/home?kw=climate&debug=1
    , m_lang = L.pathname.match(/^\/(el|en)/)
    , m_approval = L.href.match(/\/(approval|localhost|nquire\/|pegasos\.)/)
    , m_debug = L.href.match(/[\?&\/]debug=1/);

  W.angular.element("[ data-ng-controller ]").ready(function () {

    var $scope = W.angular.element("[ data-ng-controller ]").scope();

    $scope.debug = m_debug && 1;
    $scope.approval = m_approval && 1;
    $scope.activeLang = m_lang ? m_lang[ 1 ] : 'en';
    $scope.langs = {
      en: "English", //gettextCatalog.getString("English"),
      el: "Greek"
    };

    if (m_lang) {
      gettextCatalog.setCurrentLanguage($scope.activeLang);
    }

    W.$("html").attr({
      "data-debug": $scope.debug,
      "data-approval": $scope.approval,
      "data-lang_ui": $scope.activeLang
    });

    m_debug && W.console && console.log("Lang:", m_lang, N.languages, m_debug, m_approval);
  });


  // Approval/ test server message [Bug: #5]
  if (m_approval) {
    W.angular.element("[ data-ng-controller ]").ready(function () {
      setTimeout(function () {

        W.$("#header").after(
        "<p id='approval-msg'>" +
        "This is a test server <small>(some broken images!)</small> You may want <a href='http://www.nquire-it.org/'>www.nquire-it.org</a></p>"
        );

      }, 100);
    });
  }

});
