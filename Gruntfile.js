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
                src: ['**', '!js/**', '!lib/**', '!**/*.example', '!**/*.css', '!**/*.js', '!**/bower_components/**', '!**/nbproject/**', '!**/font-awesome/**', '!npm-debug.log'],
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
 
    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'cleanempty', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin'
    ]);
};
