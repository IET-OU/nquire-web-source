module.exports = function(grunt) {
	grunt.initConfig({
		nggettext_extract: {
			pot: {
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
					'locales': [
						'el'
					],
					poFilesPath: 'po/<%= locale %>.po'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-angular-gettext');
	grunt.loadNpmTasks('grunt-msg-init-merge');

	grunt.registerTask('default', [
		'nggettext_extract',
		'nggettext_compile',
		'msgInitMerge'
	]);
};
