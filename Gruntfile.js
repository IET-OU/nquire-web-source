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
				//'-W097': true,  // Ignore position of 'use strict';
				//'-W100': true,  // ??
				//'-W014': true,  // Ignore bad line breaking before '+';
				globals: {
					angular: true
				}
			},
			config: 'static/src/js/app/config.js',
			app:    'static/src/js/app/*.js',
			ctrl:   'static/src/js/app/controllers/**/*.js',
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
						'<%= js.srv %>/forum-service.js',
						'<%= js.srv %>/admin-service.js',
						'<%= js.srv %>/modal-service.js',
						'<%= js.srv %>/file-reader-service.js',
						'<%= js.srv %>/sorted-data-service.js',
						'<%= js.srv %>/tracking-service.js',
						'<%= js.srv %>/users-service.js',
						'<%= js.srv %>/filter-tag-service.js',
						'<%= js.srv %>/project-*.js'
					],
					'<%= js.out %>/project-services.min.js': '<%= js.srv %>/project-*.js'
				},
				options: {
					mangle: false  // IMPORTANT - 'mangle' must be false for services!
				}
			},
			helpers: {
				files: {
					'<%= js.out %>/helpers.min.js': 'static/src/js/helpers/*.js'
				},
				options: {
					banner: '/*!\n  nQuire-it helpers.\n*/\n\n'
				}
			},
			libs: {
				files: {
					// 3rd party libraries - order is significant - up to 'angular.js'!
					'<%= js.out %>/libs.min.js': [
						'<%= js.lib %>/jquery-2.1.0.min.js',
						'<%= js.lib %>/bootstrap.js',
						'<%= js.lib %>/angular.js',
						'<%= js.lib %>/angular-gettext-2.1.0.min.js',
						'<%= js.lib %>/angular-sanitize.js',
						'<%= js.lib %>/angular-ui-router.js',
						'<%= js.lib %>/textAngular.min.js',
						'<%= js.lib %>/textAngular-sanitize.min.js',
						'<%= js.lib %>/ui-bootstrap-tpls-0.11.0.min.js',
						'<%= js.lib %>/markerclusterer_packed.js',
						'<%= js.lib %>/oms.min.js'
					]
				},
				options: {
					banner: '/*!\n  All third-party libraries - strict order!\n*/\n',
					sourceMap: true
				}
			},
			options: {
				compress: true,
				mangle: true,
				//maxLineLen: 160,
				preserveComments: 'some'
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

	grunt.registerTask('default', [
		'gettext', 'sass', 'jshint:app', 'jshint:helper', 'jshint:serv', 'jshint:grunt', 'uglify', 'nice-package'
	]);
};
