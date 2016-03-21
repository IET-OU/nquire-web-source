/*!
  nQuire-it | GPL | © The Open University.
*/

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'static/src/css/nquire-it-bootstrap.css':
						'static/sass/nquire-it/nquire-it-bootstrap.scss'
				}
			}
		},
		jshint: {
			options: {
				laxcomma: true,
				//curly: true,
				//undef: true,
				//'-W097': true,  // Ignore position of 'use strict';
				//'-W100': true,  // ??
				//'-W014': true,  // Ignore bad line breaking before '+';
				globals: {
					angular: false, SiwFormManager: false, SiwMapRenderer: false
				}
			},
			config: 'static/src/js/app/config.js',
			app:    'static/src/js/app/*.js',
			ctrl:   'static/src/js/app/controllers/**/*.js',
			directive: 'static/src/js/app/directives/*.js',
			filter: 'static/src/js/app/filters/*.js',
			serv:   'static/src/js/app/services/*.js',
			helper: 'static/src/js/helpers/*.js',
			grunt:  'Gruntfile.js'
		},

		nggettext_extract: {
			pot: {
				// Translate strings in Javascript [Bug: #23]
				options: {
					markerNames: [ '_' ]
				},
				files: {
					'po/template.pot': [
						'static/**/*.html',
						'static/**/*.js'
					]
				}
			}
		},
		nggettext_compile: {
			all: {
				files: {
					'static/src/js/app/translations.js': [
						'po/*.po'
					]
				}
			}
		},
		msgInitMerge: {
			your_target: {
				src: [
					'po/template.pot'
				],
				options: {
					// I18n / translation - list available languages, except 'en' [Bug: #3]
					'locales': [
						'el',
						'es',
						'fr'
					],
					poFilesPath: 'po/<%= locale %>.po'
				}
			}
		},

		/* Javascript page order:
			libs, helpers, app.js, config, translations, services, directives, filters, controllers.
		*/
		js: {
			out: 'static/src/js/dist',
			lib: 'static/src/js/libs',
			srv: 'static/src/js/app/services'
		},
		uglify: {
			app: {
				files: {
					'<%= js.out %>/controllers.min.js': 'static/src/js/app/controllers/**/**/*.js',
					'<%= js.out %>/directives.min.js': 'static/src/js/app/directives/*.js',
					'<%= js.out %>/filters.min.js': 'static/src/js/app/filters/*.js',
					// Services - order is significant - up to rest OR openid !
					'<%= js.out %>/services.min.js': [
						'<%= js.srv %>/services-module.js',
						'<%= js.srv %>/alert-service.js', // Order: after 'services-module'; before 'rest-service' ?
						'<%= js.srv %>/rest-service.js',
						'<%= js.srv %>/openid-service.js',
						'<%= js.srv %>/vote-service.js',
						'<%= js.srv %>/comment-service.js',
						'<%= js.srv %>/admin-service.js',
						'<%= js.srv %>/modal-service.js',
						'<%= js.srv %>/sorted-data-service.js',
						'<%= js.srv %>/tracking-service.js',
						'<%= js.srv %>/users-service.js',
						'<%= js.srv %>/f**-service.js',   // 'file-reader', 'filter-tag', 'forum' (3)
						'<%= js.srv %>/project-*.js'
					]
				},
				options: {
					mangle: false   // IMPORTANT - 'mangle' must be false for services!
				}
			},
			helpers: {
				files: {
					'<%= js.out %>/helpers.min.js': 'static/src/js/helpers/*.js'
				}
			},
			libs: {
				files: {
					// 3rd party libraries - order is significant - up to 'angular.js'!
					'<%= js.out %>/libs.min.js': [
						'<%= js.lib %>/jquery-2.1.0.min.js',
						'<%= js.lib %>/bootstrap.js',
						'<%= js.lib %>/angular.js',
						'<%= js.lib %>/angular-**.js',    // '-gettext', '-sanitize', '-ui-router' (3)
						'<%= js.lib %>/textAngular**.js', // + '-sanitize' (2)
						'<%= js.lib %>/ui-bootstrap-tpls-0.11.0.min.js',
						'<%= js.lib %>/markerclusterer_packed.js',
						'<%= js.lib %>/oms.min.js'
					]
				},
				options: {
					banner: '/*!\n  All third-party libraries (nQuire-it).\n*/\n\n'
				}
			},
			options: {
				banner: "/*!\n  nQuire-it | GPL | © The Open University | <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>.\n*/\n\n",
				compress: true,
				mangle: true,
				preserveComments: 'some',
				sourceMap: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-angular-gettext');
	grunt.loadNpmTasks('grunt-msg-init-merge');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-nice-package');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('gettext', [
		'nggettext_extract',
		'nggettext_compile',
		'msgInitMerge'
	]);

	grunt.registerTask('jshint-x', [
		'jshint:app', 'jshint:directive', 'jshint:filter', 'jshint:serv', 'jshint:helper'
	]);

	grunt.registerTask('default', [
		'gettext', 'sass', 'jshint-x', 'jshint:grunt', 'uglify', 'nice-package'
	]);
};
