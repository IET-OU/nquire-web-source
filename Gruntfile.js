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
					angular: false //, SiwFormManager: false, SiwMapRenderer: false
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
			app: 'static/src/js/app',
			lib: 'static/src/js/libs',
			srv: 'static/src/js/app/services'
		},
		uglify: {
			app: {
				files: {
					'<%= js.out %>/app.min.js': [
						'<%= js.app %>/app.js', '<%= js.app %>/translations.js'  // Not: 'config.js'
					],
					'<%= js.out %>/controllers.min.js': '<%= js.app %>/controllers/**/**/*.js',
					'<%= js.out %>/directives.min.js': '<%= js.app %>/directives/*.js',
					'<%= js.out %>/filters.min.js': '<%= js.app %>/filters/*.js',
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
			libs: {  // 3rd party libraries - order is significant - up to 'angular.js'!
				files: {
					'<%= js.out %>/libs.min.js': [
						'node_modules/jquery/dist/jquery.min.js', // v2.1.0 >> v2.1.4;
						'<%= js.lib %>/bootstrap.js',     // v3.1.1.
						'node_modules/angular/angular.min.js',    // v1.2.13 >> v1.2.27;
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
			options: {  // Global options.
				banner: "/*!\n  nQuire-it | GPL | © The Open University | <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>.\n*/\n\n",
				compress: true,
				mangle: true,
				preserveComments: 'some',
				sourceMap: true
			}
		},

		watch: {
			app: { files: '<%= js.app %>/**/*.js', tasks: 'uglify:app' },
			helpers: { files: 'static/src/js/helpers/*.js', tasks: 'uglify:helpers' },
			sass: { files: 'static/sass/nquire-it/**/*', tasks: 'sass' }
		}
	});

	grunt.loadNpmTasks('grunt-angular-gettext');
	grunt.loadNpmTasks('grunt-msg-init-merge');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nice-package');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('gettext', [
		'nggettext_extract',
		'nggettext_compile',
		'msgInitMerge'
	]);

	grunt.registerTask('jshint-x', [
		'jshint:app', 'jshint:directive', 'jshint:filter', 'jshint:serv', 'jshint:helper' // Not 'controllers' yet!
	]);

	grunt.registerTask('default', [
		'gettext', 'sass', 'jshint-x', 'jshint:grunt', 'uglify', 'nice-package'
	]);
};
