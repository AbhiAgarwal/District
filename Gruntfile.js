'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['./*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jsbeautifier: {
            files: ['./*.js'],
            options: {}
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
};
