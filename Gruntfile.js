module.exports = function (grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        clean: {
           dist: {
               force:true,
               src: ["dist", '.tmp']
           }
        },
 
        copy: {
            main: {
                expand: true,
                cwd: 'app/',
                src: ['**', '!**/*/*.html', '!js/**', '!lib/**', '!**/*.example', '!**/*.css', '!**/*.js', '!**/bower_components/**', '!**/nbproject/**', '!**/font-awesome/**', '!npm-debug.log'],
                dest: 'dist/'
            },
            fa: {
                expand: true,
                cwd: 'app/css/font-awesome',
                src: ['fonts/**'],
                dest: 'dist/'
            },
            shims: {
                expand: true,
                cwd: 'app/lib/webshim/shims',
                src: ['**'],
                dest: 'dist/js/shims'
            }
        },

        replace: {
            DivinElegy: {
                src: ['dist/js/divinelegy.min.js'],
                overwrite: true,
                replacements: [{
                    from: /value\(\"rockEndpoint\",[^\)]*\)/g,
                    to: 'value("rockEndpoint", "http://divinelegy.com/staging/rock/public_html/")'
                }]
            }
        },

	cleanempty: {
		options: {},
		src: ['dist/**']
	},
 
        rev: {
            files: {
                src: ['dist/**/*.{js,css}', '!dist/js/shims/**']
            }
        },
 
        useminPrepare: {
            html: 'app/index.html'
        },
 
        usemin: {
            html: ['dist/index.html']
        },
 
        uglify: {
            options: {
                report: 'min',
                mangle: true
            }
        },

        ngtemplates: {
            DivinElegy: {
                cwd: 'app',
                src: ['**/*.html', '!index.html'],
                dest: '.tmp/templates.js',
                options: {
                    base: 'dist',
                    module: 'DivinElegy',
                    usemin: 'js/divinelegy.min.js',
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        conservativeCollapse:           true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true, // Only if you don't use comment directives!
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-cleanempty');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-text-replace');
 
    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'clean',
        'copy',
        'cleanempty',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'replace'
    ]);
};
