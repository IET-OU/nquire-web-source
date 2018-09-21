/*! nQuire-it | GPL | © The Open University (IET).
*/
module.exports = function (grunt) {
	'use strict';

	var pkg = grunt.file.readJSON('./package.json')
	;

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

		htmlangular: {
			options: {
				w3cproxy: httpProxy()
			},
			partials: {
				src: [ '<%= js.part %>/layout/**/*.html', '<%= js.part %>/admin/*.html' ],
				options: {
					customattrs: [ 'siw-user-link', 'translate-comment' ],
					customtags: [ 'text-angular', 'translate' ],  //'X-ng-form'
					relaxerror: [
						'A numeric character reference expanded to carriage return.',  // Eg. "&#13;"
						'Attribute “href” without an explicit value seen.', //' The attribute may be dropped by IE7.'
						'Element “head” is missing a required instance of child element “title”.',
						'Start tag seen without seeing a doctype first.',  //' Expected e.g. “<!DOCTYPE html>”.'
						'End of file seen without seeing a doctype first.' //' Expected e.g. “<!DOCTYPE html>”.'
					]
				}
			},
			index: [ 'static/src/ie8.htm', 'static/src/index.html' ]
		},

		jshint: {
			options: {
				bitwise: true,
				curly: true,
				eqeqeq: true,
				futurehostile: true,
				laxcomma: true,
				undef: true,
				//unused: true,
				// https://github.com/jshint/jshint/blob/master/src/messages.js#L80
				'-W018': true,    // Ignore confusing use of 'a';
				'-W069': true,    // Ignore ['a'] is better written in dot notation;
				//'-W097': true,  // Ignore position of 'use strict';
				//'-W100': true,  // Ignore this character may get silently deleted by...;
				//'-W117': true,  // Ignore 'a' is not defined;
				//'-W014': true,  // Ignore bad line breaking before '+';
				globals: {
					//_: false,
					angular:false, FileReader:false, FormData:false, google:false, grecaptcha:false, MarkerClusterer:false, OverlappingMarkerSpiderfier:true, SigUtils:true,
					SiwClone:true, SiwColorGenerator:true, siwCompare:true, SiwFormManager:true, SiwMapIcons:true, SiwMapRenderer:true, SiwSenseItSensorData:true, SiwSenseItTransformations:true
				}
			},
			app:    'static/src/js/app/*.js',
			ctrl:   'static/src/js/app/controllers/**/*.js',
			directive: 'static/src/js/app/directives/*.js',
			filter: 'static/src/js/app/filters/*.js',
			serv:   'static/src/js/app/services/*.js',
			helper: 'static/src/js/helpers/*.js',
			bin: {
				files: {
					src: [ 'bin/*.js', 'Gruntfile.js' ]
				},
				options: {
					esversion: 6,
					node: true  //globals: { module:false, require:false, console:false, process:false, __dirname:false }
			  }
			}
		},

		nggettext_extract: {
			pot: {
				// Translate strings in Javascript [Bug: #23]
				options: {
					markerNames: [ '_' ]
				},
				files: {
					'po/template.pot': [
						'static/**/*.html',   //'static/src/partials/**/*.html',
						'static/src/js/app/**/*.js'  // Exclude 'js/dist/**' files.
					]
				}
			}
		},
		nggettext_compile: {
			nQuire_it: {
				files: {
					'static/src/js/app/translations.js': [ 'po/*.po' ]
				}
			}
		},
		msgInitMerge: {  // requires Grunt ~0.4.5.
			nQuire_it: {
				src: [ 'po/template.pot' ],
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
		nm: 'node_modules',
		js: {
			part: 'static/src/partials',
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
						'<%= js.srv %>/p**-service.js'    // 'project-*', 'page-title' (8)
					]
				},
				options: { mangle: false  /* IMPORTANT - 'mangle' must be false for services! */ }
			},
			helpers: {
				files: { '<%= js.out %>/helpers.min.js': 'static/src/js/helpers/*.js' }
			},
			jquery: {
				files: {
					'<%= js.out %>/jquery-2.x.min.js': 'node_modules/jquery/dist/jquery.min.js'
				},
				options: {
					banner: "/*!\n  3rd-party library | nQuire-it | <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>.\n*/\n"
				}
			},
			libs: {  // 3rd party libraries - order is significant - up to 'angular.js'!
				files: {
					'<%= js.out %>/libs.min.js': [
						'node_modules/jquery/dist/jquery.min.js', // v2.2.x;
						'<%= nm %>/bootstrap-sass/javascripts/bootstrap.min.js', // v3.3.x;
						'<%= nm %>/angular/angular.min.js',    // v1.5.x;
						'<%= nm %>/angular-gettext/dist/angular-gettext.min.js',  // v2.3.x;
						'<%= nm %>/textangular/dist/textAngular-*.min.js', // -rangy 1.3.0 + -sanitize;
						'<%= nm %>/textangular/dist/textAngular.min.js',  // v1.5.x;
						'<%= nm %>/angular-ui-router/release/angular-ui-router.min.js',  // v0.4.2;
						'<%= nm %>/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',  // v2.5.x;
						'<%= js.lib %>/markerclusterer.min.js',
						'<%= js.lib %>/oms.min.js'  // v0.3.3
					]
				},
				options: {
					mangle: false,  /* Apparently needed - otherwise we get
						"Uncaught RangeError: Maximum call stack size exceeded at l (textAngular-rangy.min.js:23)"
						(Also: https://docs.angularjs.org/error/$injector/undef?p0=PageTitleService) */
					banner: "/*!\n  All 3rd-party libraries | nQuire-it | <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>.\n*/\n\n"
				}
			},
			options: {  // Global uglify options.
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-html-angular-validate');
	grunt.loadNpmTasks('grunt-nice-package');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('help', help);

	grunt.registerTask('gettext', [
		'nggettext_extract', 'nggettext_compile'
	]);

	grunt.registerTask('test', [
		'gettext', 'htmlangular:index', 'sass', 'jshint', 'uglify', 'nice-package'
	]);

	grunt.registerTask('default', [
		'gettext', 'sass', 'jshint', 'uglify', 'nice-package'
	]);


	/* ================================== */

	function httpProxy() {
		var http_proxy = process.env.HTTP_PROXY || false; // Default is false, not null(?)
		if (http_proxy) {
			http_proxy = http_proxy.replace(/https?:\/\//, '');
			http_proxy = 'http://' + http_proxy;
		}
		grunt.log.debug('HTTP proxy?', http_proxy || '<none>');
		return http_proxy;
	}

	function isTravis() {
		return false;  //Was: process.env.TRAVIS || false;
	}

	function help() {
		var version = grunt.file.readJSON('./static/src/version.json');

		grunt.log.subhead('nQuire-it help\n');
		grunt.log.ok(
	'Run `grunt --help` to list available tasks.\n' +
	'Copyright © 2017 The Open University (IET) <http://iet.open.ac.uk>\n' +
	'License: GNU GPL (see LICENSE.txt)\n' +
	'Version: ' + version.describe
		);
	}
};
